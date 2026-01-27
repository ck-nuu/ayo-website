'use client';

import { useState } from 'react';
import { HeroContent, updateSiteContent, uploadSiteImage } from '@/app/admin/site-content/actions';
import Image from 'next/image';

interface HeroFormProps {
    initialData: HeroContent | null;
}

export default function HeroForm({ initialData }: HeroFormProps) {
    const [formData, setFormData] = useState<HeroContent>(
        initialData || {
            title_line1: 'Ayomide',
            title_line2: 'Abolaji',
            tagline: '',
            image_url: ''
        }
    );
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onload = (ev) => setPreviewImage(ev.target?.result as string);
        reader.readAsDataURL(file);

        // Upload image
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const result = await uploadSiteImage(uploadFormData);
        if (result.url) {
            setFormData(prev => ({ ...prev, image_url: result.url! }));
        } else {
            setMessage({ type: 'error', text: result.error || 'Upload failed' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const result = await updateSiteContent('hero', formData);

        if (result.success) {
            setMessage({ type: 'success', text: 'Hero content updated successfully!' });
            setPreviewImage(null);
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to update' });
        }

        setLoading(false);
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.75rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'inherit',
        fontSize: '1rem',
        borderRadius: '4px'
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: 500,
        color: 'var(--secondary)'
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Title Line 1 */}
                <div>
                    <label style={labelStyle}>Title Line 1</label>
                    <input
                        type="text"
                        value={formData.title_line1}
                        onChange={(e) => setFormData(prev => ({ ...prev, title_line1: e.target.value }))}
                        style={inputStyle}
                        placeholder="e.g., Ayomide"
                    />
                </div>

                {/* Title Line 2 */}
                <div>
                    <label style={labelStyle}>Title Line 2</label>
                    <input
                        type="text"
                        value={formData.title_line2}
                        onChange={(e) => setFormData(prev => ({ ...prev, title_line2: e.target.value }))}
                        style={inputStyle}
                        placeholder="e.g., Abolaji"
                    />
                </div>

                {/* Tagline */}
                <div>
                    <label style={labelStyle}>Tagline / Quote</label>
                    <textarea
                        value={formData.tagline}
                        onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                        style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                        placeholder="Enter a tagline or quote..."
                    />
                </div>

                {/* Hero Image */}
                <div>
                    <label style={labelStyle}>Hero Image</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        {(previewImage || formData.image_url) && (
                            <div style={{
                                width: '150px',
                                height: '200px',
                                position: 'relative',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <Image
                                    src={previewImage || formData.image_url}
                                    alt="Hero preview"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        )}
                        <div style={{ flex: 1 }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{
                                    ...inputStyle,
                                    padding: '0.5rem',
                                    cursor: 'pointer'
                                }}
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: '0.5rem' }}>
                                Or enter URL directly:
                            </p>
                            <input
                                type="text"
                                value={formData.image_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                style={{ ...inputStyle, marginTop: '0.25rem' }}
                                placeholder="/path/to/image.jpg"
                            />
                        </div>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div style={{
                        padding: '1rem',
                        background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        borderRadius: '4px',
                        color: message.type === 'success' ? '#10b981' : '#ef4444'
                    }}>
                        {message.text}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '1rem 2rem',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        cursor: loading ? 'wait' : 'pointer',
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        opacity: loading ? 0.7 : 1,
                        transition: 'opacity 0.2s'
                    }}
                >
                    {loading ? 'Saving...' : 'Save Hero Content'}
                </button>
            </div>
        </form>
    );
}
