'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';
import {
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioImage,
    getAccessToken,
    createPortfolioItemWithUrls,
    updatePortfolioItemWithUrls
} from '@/app/admin/portfolio/actions';
import { compressImage, compressImages, formatFileSize } from '@/utils/imageCompression';
import { uploadWithTus, uploadMultipleWithTus, formatBytes } from '@/utils/tusUpload';

const taxonomy: Record<string, string[]> = {
    Modelling: ['Editorial', 'Commercial/E-com', 'Beauty'],
    Music: ['Features', 'Lead'],
    Poetry: ['Published', 'Selected Works', 'Voice'],
};

interface PortfolioImage {
    id: string;
    image_url: string;
    sort_order: number;
}

interface PortfolioItemWithImages {
    id: string;
    title: string;
    discipline: string;
    subcategory: string;
    year: string;
    month?: number | null;
    image_url: string;
    link?: string | null;
    association?: string | null;
    additional_images?: PortfolioImage[];
}

interface PortfolioFormProps {
    initialData?: PortfolioItemWithImages;
}

export default function PortfolioForm({ initialData }: PortfolioFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [discipline, setDiscipline] = useState(initialData?.discipline || 'Modelling');
    const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.image_url || null);
    const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<PortfolioImage[]>(initialData?.additional_images || []);

    // Compression states
    const [compressing, setCompressing] = useState(false);
    const [compressionProgress, setCompressionProgress] = useState(0);
    const [compressionStats, setCompressionStats] = useState<{ original: number; compressed: number } | null>(null);

    // Upload states (for TUS)
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const [totalFiles, setTotalFiles] = useState(0);

    // Store compressed files
    const compressedCoverRef = useRef<File | null>(null);
    const compressedAdditionalRef = useRef<File[]>([]);

    const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverPreview(URL.createObjectURL(file));
            setCompressing(true);
            setCompressionStats(null);

            try {
                const originalSize = file.size;
                const compressed = await compressImage(file, {
                    onProgress: setCompressionProgress
                });
                compressedCoverRef.current = compressed;

                setCompressionStats({
                    original: originalSize,
                    compressed: compressed.size
                });
            } catch (err) {
                console.error('Compression failed:', err);
                compressedCoverRef.current = file; // Fallback to original
            } finally {
                setCompressing(false);
                setCompressionProgress(0);
            }
        }
    };

    const handleAdditionalImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            const previews = fileArray.map(f => URL.createObjectURL(f));
            setAdditionalPreviews(previews);
            setCompressing(true);
            setCompressionStats(null);

            try {
                const originalSize = fileArray.reduce((sum, f) => sum + f.size, 0);
                const compressed = await compressImages(
                    fileArray,
                    {},
                    setCompressionProgress
                );
                compressedAdditionalRef.current = compressed;

                const compressedSize = compressed.reduce((sum, f) => sum + f.size, 0);
                setCompressionStats({
                    original: originalSize,
                    compressed: compressedSize
                });
            } catch (err) {
                console.error('Compression failed:', err);
                compressedAdditionalRef.current = fileArray; // Fallback to originals
            } finally {
                setCompressing(false);
                setCompressionProgress(0);
            }
        }
    };

    const handleDeleteExistingImage = async (img: PortfolioImage) => {
        if (!confirm('Delete this image?')) return;

        const result = await deletePortfolioImage(img.id, img.image_url);
        if (!result.error) {
            setExistingImages(prev => prev.filter(i => i.id !== img.id));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Don't submit while compressing or uploading
        if (compressing) {
            setError('Please wait for image compression to complete');
            return;
        }
        if (uploading) {
            setError('Upload in progress');
            return;
        }

        const formElement = e.currentTarget;
        const title = (formElement.querySelector('[name="title"]') as HTMLInputElement).value;
        const formDiscipline = (formElement.querySelector('[name="discipline"]') as HTMLSelectElement).value;
        const subcategory = (formElement.querySelector('[name="subcategory"]') as HTMLSelectElement).value;
        const year = (formElement.querySelector('[name="year"]') as HTMLInputElement).value;
        const month = parseInt((formElement.querySelector('[name="month"]') as HTMLSelectElement).value, 10);
        const link = (formElement.querySelector('[name="link"]') as HTMLInputElement).value || null;
        const association = (formElement.querySelector('[name="association"]') as HTMLInputElement).value || null;

        // Check if we have new files to upload
        const hasCoverToUpload = compressedCoverRef.current !== null;
        const hasAdditionalToUpload = compressedAdditionalRef.current.length > 0;
        const needsTusUpload = hasCoverToUpload || hasAdditionalToUpload;

        // For small files or no new files, use the original FormData approach
        if (!needsTusUpload) {
            setLoading(true);
            setError(null);

            try {
                let result;
                if (initialData) {
                    result = await updatePortfolioItemWithUrls(initialData.id, {
                        title,
                        discipline: formDiscipline,
                        subcategory,
                        year,
                        month,
                        link,
                        association,
                    });
                } else {
                    // Can't create without an image
                    setError('Cover image is required');
                    setLoading(false);
                    return;
                }

                if (result.error) {
                    setError(result.error);
                    setLoading(false);
                } else {
                    router.push('/admin/portfolio');
                    router.refresh();
                }
            } catch {
                setError('Something went wrong. Please try again.');
                setLoading(false);
            }
            return;
        }

        // Use TUS for uploading files
        setUploading(true);
        setError(null);
        setUploadProgress(0);

        try {
            // Get access token for TUS
            const tokenResult = await getAccessToken();
            if (tokenResult.error || !tokenResult.accessToken) {
                setError('Authentication error. Please refresh and try again.');
                setUploading(false);
                return;
            }
            const accessToken = tokenResult.accessToken;

            const filesToUpload: File[] = [];
            if (hasCoverToUpload) filesToUpload.push(compressedCoverRef.current!);
            filesToUpload.push(...compressedAdditionalRef.current);

            setTotalFiles(filesToUpload.length);

            let coverImageUrl: string | null = null;
            const additionalImageUrls: string[] = [];

            // Upload cover image first
            if (hasCoverToUpload) {
                setCurrentFileIndex(1);
                setUploadStatus('Uploading cover image...');

                const coverResult = await uploadWithTus(
                    compressedCoverRef.current!,
                    accessToken,
                    {
                        bucketName: 'portfolio',
                        onProgress: (percentage) => {
                            setUploadProgress(percentage);
                        },
                    }
                );

                if (!coverResult.success || !coverResult.url) {
                    setError(coverResult.error || 'Failed to upload cover image');
                    setUploading(false);
                    return;
                }
                coverImageUrl = coverResult.url;
            }

            // Upload additional images
            if (hasAdditionalToUpload) {
                for (let i = 0; i < compressedAdditionalRef.current.length; i++) {
                    const file = compressedAdditionalRef.current[i];
                    const fileIndex = hasCoverToUpload ? i + 2 : i + 1;
                    setCurrentFileIndex(fileIndex);
                    setUploadStatus(`Uploading image ${fileIndex} of ${filesToUpload.length}...`);

                    const result = await uploadWithTus(
                        file,
                        accessToken,
                        {
                            bucketName: 'portfolio',
                            onProgress: (percentage) => {
                                setUploadProgress(percentage);
                            },
                        }
                    );

                    if (!result.success || !result.url) {
                        setError(result.error || `Failed to upload image ${fileIndex}`);
                        setUploading(false);
                        return;
                    }
                    additionalImageUrls.push(result.url);
                }
            }

            // All uploads complete, now save to database
            setUploadStatus('Saving project...');
            setLoading(true);

            let result;
            if (initialData) {
                result = await updatePortfolioItemWithUrls(initialData.id, {
                    title,
                    discipline: formDiscipline,
                    subcategory,
                    year,
                    month,
                    link,
                    association,
                    newCoverImageUrl: coverImageUrl,
                    newAdditionalImageUrls: additionalImageUrls.length > 0 ? additionalImageUrls : undefined,
                });
            } else {
                if (!coverImageUrl) {
                    setError('Cover image is required');
                    setUploading(false);
                    setLoading(false);
                    return;
                }
                result = await createPortfolioItemWithUrls({
                    title,
                    discipline: formDiscipline,
                    subcategory,
                    year,
                    month,
                    link,
                    association,
                    coverImageUrl,
                    additionalImageUrls: additionalImageUrls.length > 0 ? additionalImageUrls : undefined,
                });
            }

            if (result.error) {
                setError(result.error);
                setLoading(false);
                setUploading(false);
            } else {
                router.push('/admin/portfolio');
                router.refresh();
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Something went wrong. Please try again.');
            setUploading(false);
            setLoading(false);
        }
    };

    const inputStyle = {
        padding: '0.8rem',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'var(--foreground)',
        fontSize: '1rem'
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && (
                <div style={{ padding: '1rem', background: 'rgba(255, 0, 0, 0.1)', border: '1px solid red', color: 'red' }}>
                    {error}
                </div>
            )}

            {/* Compression Progress */}
            {compressing && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(86, 132, 25, 0.1)',
                    border: '1px solid var(--accent)',
                    borderRadius: '4px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                            Compressing images... {Math.round(compressionProgress)}%
                        </span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${compressionProgress}%`,
                            height: '100%',
                            background: 'var(--accent)',
                            transition: 'width 0.2s ease'
                        }} />
                    </div>
                </div>
            )}

            {/* Compression Stats */}
            {compressionStats && !compressing && !uploading && (
                <div style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(86, 132, 25, 0.15)',
                    border: '1px solid var(--accent)',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    color: 'var(--foreground)'
                }}>
                    ✓ Images optimized: {formatFileSize(compressionStats.original)} → {formatFileSize(compressionStats.compressed)}
                    <span style={{ opacity: 0.7, marginLeft: '0.5rem' }}>
                        (saved {((1 - compressionStats.compressed / compressionStats.original) * 100).toFixed(0)}%)
                    </span>
                </div>
            )}

            {/* Upload Progress (TUS) */}
            {uploading && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(116, 34, 108, 0.1)',
                    border: '1px solid var(--secondary)',
                    borderRadius: '4px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                            {uploadStatus || `Uploading file ${currentFileIndex} of ${totalFiles}...`}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>
                            {Math.round(uploadProgress)}%
                        </span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${uploadProgress}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--accent), var(--secondary))',
                            transition: 'width 0.2s ease'
                        }} />
                    </div>
                    {totalFiles > 1 && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--secondary)' }}>
                            File {currentFileIndex} of {totalFiles}
                        </div>
                    )}
                </div>
            )}

            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Title</label>
                <input
                    type="text"
                    name="title"
                    defaultValue={initialData?.title}
                    required
                    style={inputStyle}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Discipline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Discipline</label>
                    <select
                        name="discipline"
                        value={discipline}
                        onChange={(e) => setDiscipline(e.target.value)}
                        style={inputStyle}
                    >
                        {Object.keys(taxonomy).map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                {/* Subcategory */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Subcategory</label>
                    <select
                        name="subcategory"
                        defaultValue={initialData?.subcategory}
                        style={inputStyle}
                    >
                        {taxonomy[discipline].map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                {/* Year */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Year</label>
                    <input
                        type="text"
                        name="year"
                        defaultValue={initialData?.year || new Date().getFullYear().toString()}
                        required
                        style={inputStyle}
                    />
                </div>

                {/* Month */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Month</label>
                    <select
                        name="month"
                        defaultValue={initialData?.month || new Date().getMonth() + 1}
                        style={inputStyle}
                    >
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </select>
                </div>

                {/* Link */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Link (Optional)</label>
                    <input
                        type="url"
                        name="link"
                        defaultValue={initialData?.link || ''}
                        placeholder="https://..."
                        style={inputStyle}
                    />
                </div>
            </div>

            {/* Association */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>
                    Association <span style={{ opacity: 0.6 }}>(e.g., Freelance Work, Brand Campaign, Agency Name)</span>
                </label>
                <input
                    type="text"
                    name="association"
                    defaultValue={initialData?.association || ''}
                    placeholder="e.g., Galacta Agency, Freelance Work, Brand Campaign"
                    style={inputStyle}
                />
            </div>

            {/* Cover Image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Cover Image</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    required={!initialData}
                    style={inputStyle}
                />
                {coverPreview && (
                    <div style={{ marginTop: '1rem', position: 'relative', width: '200px', aspectRatio: '16/10' }}>
                        <Image
                            src={coverPreview}
                            alt="Cover Preview"
                            fill
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />
                    </div>
                )}
            </div>

            {/* Additional Images */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>
                    Additional Gallery Images {discipline === 'Modelling' && <span style={{ opacity: 0.6 }}>(Recommended for Modelling projects)</span>}
                </label>
                <input
                    type="file"
                    name="additional_images"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    style={inputStyle}
                />

                {/* Preview of new additional images */}
                {additionalPreviews.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>New images to upload:</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {additionalPreviews.map((preview, idx) => (
                                <div key={idx} style={{ position: 'relative', width: '100px', aspectRatio: '1/1' }}>
                                    <Image
                                        src={preview}
                                        alt={`Preview ${idx + 1}`}
                                        fill
                                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Existing additional images (edit mode) */}
                {existingImages.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Existing gallery images:</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {existingImages.map((img) => (
                                <div key={img.id} style={{ position: 'relative', width: '100px', aspectRatio: '1/1' }}>
                                    <Image
                                        src={img.image_url}
                                        alt="Gallery image"
                                        fill
                                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteExistingImage(img)}
                                        style={{
                                            position: 'absolute',
                                            top: '4px',
                                            right: '4px',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: 'rgba(0,0,0,0.7)',
                                            border: 'none',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 0
                                        }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '2rem' }}>
                <button
                    type="submit"
                    disabled={loading || compressing || uploading}
                    style={{
                        padding: '1rem 2rem',
                        background: 'var(--foreground)',
                        color: 'var(--background)',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: (loading || compressing || uploading) ? 'not-allowed' : 'pointer',
                        opacity: (loading || compressing || uploading) ? 0.7 : 1
                    }}
                >
                    {compressing ? 'Compressing...' : uploading ? 'Uploading...' : loading ? 'Saving...' : (initialData ? 'Update Project' : 'Create Project')}
                </button>
            </div>
        </form>
    );
}
