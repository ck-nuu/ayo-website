'use client';

import { useState } from 'react';
import {
    AboutIntroContent,
    AboutDisciplinesContent,
    AboutExperienceContent,
    AboutCtaContent,
    DisciplineItem,
    ExperienceItem,
    updateSiteContent,
    uploadSiteImage
} from '@/app/admin/site-content/actions';
import Image from 'next/image';
import { Plus, Trash2 } from 'lucide-react';

interface AboutFormProps {
    introData: AboutIntroContent | null;
    disciplinesData: AboutDisciplinesContent | null;
    experienceData: AboutExperienceContent | null;
    ctaData: AboutCtaContent | null;
}

export default function AboutForm({ introData, disciplinesData, experienceData, ctaData }: AboutFormProps) {
    const [intro, setIntro] = useState<AboutIntroContent>(
        introData || { heading: 'About', bio: '', quote: '', image_url: '' }
    );
    const [disciplines, setDisciplines] = useState<DisciplineItem[]>(
        disciplinesData?.items || []
    );
    const [experience, setExperience] = useState<ExperienceItem[]>(
        experienceData?.items || []
    );
    const [cta, setCta] = useState<AboutCtaContent>(
        ctaData || { heading: '', subtitle: '', button_text: 'Get in Touch', button_link: '/contact' }
    );

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

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

    const sectionStyle: React.CSSProperties = {
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        marginBottom: '2rem'
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => setPreviewImage(ev.target?.result as string);
        reader.readAsDataURL(file);

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const result = await uploadSiteImage(uploadFormData);
        if (result.url) {
            setIntro(prev => ({ ...prev, image_url: result.url! }));
        } else {
            setMessage({ type: 'error', text: result.error || 'Upload failed' });
        }
    };

    const addDiscipline = () => {
        setDisciplines(prev => [...prev, { title: '', description: '' }]);
    };

    const removeDiscipline = (index: number) => {
        setDisciplines(prev => prev.filter((_, i) => i !== index));
    };

    const updateDiscipline = (index: number, field: keyof DisciplineItem, value: string) => {
        setDisciplines(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const addExperience = () => {
        setExperience(prev => [...prev, { year: new Date().getFullYear().toString(), title: '' }]);
    };

    const removeExperience = (index: number) => {
        setExperience(prev => prev.filter((_, i) => i !== index));
    };

    const updateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
        setExperience(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Update all sections
            const results = await Promise.all([
                updateSiteContent('about_intro', intro),
                updateSiteContent('about_disciplines', { items: disciplines }),
                updateSiteContent('about_experience', { items: experience }),
                updateSiteContent('about_cta', cta)
            ]);

            const hasError = results.some(r => r.error);
            if (hasError) {
                setMessage({ type: 'error', text: 'Some sections failed to update' });
            } else {
                setMessage({ type: 'success', text: 'About page content updated successfully!' });
                setPreviewImage(null);
            }
        } catch {
            setMessage({ type: 'error', text: 'An error occurred' });
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Intro Section */}
            <div style={sectionStyle}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                    Introduction Section
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Heading</label>
                        <input
                            type="text"
                            value={intro.heading}
                            onChange={(e) => setIntro(prev => ({ ...prev, heading: e.target.value }))}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Bio</label>
                        <textarea
                            value={intro.bio}
                            onChange={(e) => setIntro(prev => ({ ...prev, bio: e.target.value }))}
                            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Quote</label>
                        <textarea
                            value={intro.quote}
                            onChange={(e) => setIntro(prev => ({ ...prev, quote: e.target.value }))}
                            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Profile Image</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            {(previewImage || intro.image_url) && (
                                <div style={{
                                    width: '100px',
                                    height: '150px',
                                    position: 'relative',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <Image
                                        src={previewImage || intro.image_url}
                                        alt="Profile preview"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle} />
                                <input
                                    type="text"
                                    value={intro.image_url}
                                    onChange={(e) => setIntro(prev => ({ ...prev, image_url: e.target.value }))}
                                    style={{ ...inputStyle, marginTop: '0.5rem' }}
                                    placeholder="Or enter URL"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disciplines Section */}
            <div style={sectionStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>Disciplines</h3>
                    <button
                        type="button"
                        onClick={addDiscipline}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'inherit',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {disciplines.map((item, index) => (
                        <div key={index} style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 2fr auto',
                            gap: '0.5rem',
                            alignItems: 'start'
                        }}>
                            <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateDiscipline(index, 'title', e.target.value)}
                                style={inputStyle}
                                placeholder="Title"
                            />
                            <textarea
                                value={item.description}
                                onChange={(e) => updateDiscipline(index, 'description', e.target.value)}
                                style={{ ...inputStyle, minHeight: '60px' }}
                                placeholder="Description"
                            />
                            <button
                                type="button"
                                onClick={() => removeDiscipline(index)}
                                style={{
                                    padding: '0.75rem',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    borderRadius: '4px'
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Experience Section */}
            <div style={sectionStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>Experience</h3>
                    <button
                        type="button"
                        onClick={addExperience}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'inherit',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {experience.map((item, index) => (
                        <div key={index} style={{
                            display: 'grid',
                            gridTemplateColumns: '100px 1fr auto',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}>
                            <input
                                type="text"
                                value={item.year}
                                onChange={(e) => updateExperience(index, 'year', e.target.value)}
                                style={inputStyle}
                                placeholder="Year"
                            />
                            <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateExperience(index, 'title', e.target.value)}
                                style={inputStyle}
                                placeholder="Title / Project"
                            />
                            <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                style={{
                                    padding: '0.75rem',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    borderRadius: '4px'
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div style={sectionStyle}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                    Call to Action
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Heading</label>
                        <input
                            type="text"
                            value={cta.heading}
                            onChange={(e) => setCta(prev => ({ ...prev, heading: e.target.value }))}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Subtitle</label>
                        <input
                            type="text"
                            value={cta.subtitle}
                            onChange={(e) => setCta(prev => ({ ...prev, subtitle: e.target.value }))}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Button Text</label>
                        <input
                            type="text"
                            value={cta.button_text}
                            onChange={(e) => setCta(prev => ({ ...prev, button_text: e.target.value }))}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Button Link</label>
                        <input
                            type="text"
                            value={cta.button_link}
                            onChange={(e) => setCta(prev => ({ ...prev, button_link: e.target.value }))}
                            style={inputStyle}
                        />
                    </div>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1.5rem',
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
                    width: '100%'
                }}
            >
                {loading ? 'Saving...' : 'Save About Page Content'}
            </button>
        </form>
    );
}
