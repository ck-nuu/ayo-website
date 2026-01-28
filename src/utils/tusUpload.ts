import * as tus from 'tus-js-client';
import { v4 as uuidv4 } from 'uuid';

export interface TusUploadOptions {
    bucketName: string;
    fileName?: string;
    onProgress?: (percentage: number, bytesUploaded: number, bytesTotal: number) => void;
    onError?: (error: Error) => void;
    onSuccess?: (url: string) => void;
}

export interface TusUploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

/**
 * Extract project ID from Supabase URL
 */
function getProjectId(): string {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    // Extract project ID from URL like https://vbndiljxdoyhmhtofrbs.supabase.co
    const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
    if (!match) {
        throw new Error('Invalid Supabase URL format');
    }
    return match[1];
}

/**
 * Upload a file using TUS resumable upload protocol
 * This is ideal for large files (>6MB) as it supports:
 * - Resumable uploads (can resume if connection drops)
 * - Progress tracking
 * - Automatic retries
 */
export async function uploadWithTus(
    file: File,
    accessToken: string,
    options: TusUploadOptions
): Promise<TusUploadResult> {
    const projectId = getProjectId();
    const bucketName = options.bucketName;

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = options.fileName || `${uuidv4()}.${fileExt}`;

    return new Promise((resolve) => {
        const upload = new tus.Upload(file, {
            // Use direct storage hostname for better performance
            endpoint: `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`,

            // Retry delays in milliseconds
            retryDelays: [0, 3000, 5000, 10000, 20000],

            headers: {
                authorization: `Bearer ${accessToken}`,
                'x-upsert': 'true', // Overwrite if exists
            },

            uploadDataDuringCreation: true,
            removeFingerprintOnSuccess: true,

            metadata: {
                bucketName: bucketName,
                objectName: fileName,
                contentType: file.type,
                cacheControl: '3600',
            },

            chunkSize: 6 * 1024 * 1024, // 6MB chunks

            onError: (error) => {
                console.error('[TUS] Upload error:', error);
                options.onError?.(error);
                resolve({
                    success: false,
                    error: error.message || 'Upload failed',
                });
            },

            onProgress: (bytesUploaded, bytesTotal) => {
                const percentage = (bytesUploaded / bytesTotal) * 100;
                options.onProgress?.(percentage, bytesUploaded, bytesTotal);
            },

            onSuccess: () => {
                // Construct the public URL
                const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${fileName}`;
                console.log('[TUS] Upload complete:', publicUrl);
                options.onSuccess?.(publicUrl);
                resolve({
                    success: true,
                    url: publicUrl,
                });
            },
        });

        // Check for previous uploads and resume if possible
        upload.findPreviousUploads().then((previousUploads) => {
            if (previousUploads.length > 0) {
                console.log('[TUS] Resuming previous upload');
                upload.resumeFromPreviousUpload(previousUploads[0]);
            }
            upload.start();
        });
    });
}

/**
 * Upload multiple files with TUS
 */
export async function uploadMultipleWithTus(
    files: File[],
    accessToken: string,
    options: Omit<TusUploadOptions, 'fileName' | 'onSuccess'> & {
        onFileProgress?: (fileIndex: number, percentage: number) => void;
        onFileComplete?: (fileIndex: number, url: string) => void;
        onAllComplete?: (urls: string[]) => void;
    }
): Promise<TusUploadResult[]> {
    const results: TusUploadResult[] = [];
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const result = await uploadWithTus(file, accessToken, {
            bucketName: options.bucketName,
            onProgress: (percentage) => {
                options.onFileProgress?.(i, percentage);
            },
            onError: options.onError,
            onSuccess: (url) => {
                urls.push(url);
                options.onFileComplete?.(i, url);
            },
        });

        results.push(result);

        // Stop if any upload fails
        if (!result.success) {
            break;
        }
    }

    if (urls.length === files.length) {
        options.onAllComplete?.(urls);
    }

    return results;
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
