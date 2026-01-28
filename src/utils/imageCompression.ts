import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
    onProgress?: (progress: number) => void;
}

const defaultOptions: CompressionOptions = {
    maxSizeMB: 2, // Max 2MB per image - good balance for galleries
    maxWidthOrHeight: 2400, // Max dimension - maintains good quality for galleries
    useWebWorker: true, // Use web worker for better performance
};

/**
 * Compress a single image file
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed image file
 */
export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<File> {
    // If file is already small enough, return it as-is
    const maxSizeMB = options.maxSizeMB || defaultOptions.maxSizeMB!;
    if (file.size / 1024 / 1024 < maxSizeMB * 0.5) {
        return file;
    }

    const compressionOptions = {
        ...defaultOptions,
        ...options,
    };

    try {
        const compressedFile = await imageCompression(file, compressionOptions);

        // Log compression results for debugging
        const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
        const compressedSizeMB = (compressedFile.size / 1024 / 1024).toFixed(2);
        const savedPercent = ((1 - compressedFile.size / file.size) * 100).toFixed(1);

        console.log(
            `[ImageCompression] ${file.name}: ${originalSizeMB}MB → ${compressedSizeMB}MB (saved ${savedPercent}%)`
        );

        return compressedFile;
    } catch (error) {
        console.error('[ImageCompression] Error compressing image:', error);
        // Return original file if compression fails
        return file;
    }
}

/**
 * Compress multiple image files
 * @param files - Array of image files to compress
 * @param options - Compression options
 * @param onOverallProgress - Callback for overall progress (0-100)
 * @returns Array of compressed image files
 */
export async function compressImages(
    files: File[],
    options: CompressionOptions = {},
    onOverallProgress?: (progress: number) => void
): Promise<File[]> {
    const compressedFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Create progress callback that factors in overall position
        const onProgress = (progress: number) => {
            if (onOverallProgress) {
                const overallProgress = ((i + progress / 100) / files.length) * 100;
                onOverallProgress(overallProgress);
            }
            if (options.onProgress) {
                options.onProgress(progress);
            }
        };

        const compressed = await compressImage(file, { ...options, onProgress });
        compressedFiles.push(compressed);
    }

    if (onOverallProgress) {
        onOverallProgress(100);
    }

    return compressedFiles;
}

/**
 * Get human-readable file size
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
