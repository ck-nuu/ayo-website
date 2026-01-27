'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';
import { createPortfolioItem, updatePortfolioItem, deletePortfolioImage } from '@/app/admin/portfolio/actions';

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

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const previews = Array.from(files).map(f => URL.createObjectURL(f));
            setAdditionalPreviews(previews);
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
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            let result;
            if (initialData) {
                result = await updatePortfolioItem(initialData.id, formData);
            } else {
                result = await createPortfolioItem(formData);
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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
                    disabled={loading}
                    style={{
                        padding: '1rem 2rem',
                        background: 'var(--foreground)',
                        color: 'var(--background)',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Saving...' : (initialData ? 'Update Project' : 'Create Project')}
                </button>
            </div>
        </form>
    );
}
