import type { Metadata } from 'next';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Media Hub | Ayomide Abolaji',
    description: 'Watch featured videos, browse the photo gallery, and connect with Ayomide Abolaji on social media.',
};

// Custom TikTok icon
const TikTokIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

// Sample video from Wishtrend project
const videoUrl = '/projects/2024-02_Wishtrend_Bakuchiol_Line/WhatsApp Video 2024-02-26 at 15.22.03.mp4';

// Gallery images for the media page
const galleryImages = [
    '/projects/2023-05_Kiuna_Kim_Photography/ayo-15.jpg',
    '/projects/2023-05_Kiuna_Kim_Photography/ayo-47.jpg',
    '/projects/2023-05_Kiuna_Kim_Photography/ayo-65.jpg',
    '/projects/2023-05_Kiuna_Kim_Photography/ayo-72.jpg',
    '/projects/2024-02_Wishtrend_Bakuchiol_Line/Model Ayo 02.jpg',
    '/projects/2024-02_Wishtrend_Bakuchiol_Line/Model Ayo 03.jpg',
];

export default function MediaPage() {
    return (
        <main style={{ paddingTop: '120px', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="display-text" style={{ marginBottom: '1rem' }}>Media</h1>
                    <p className="body-text" style={{ color: 'var(--secondary)' }}>
                        Videos, photos, and social content
                    </p>
                </div>

                {/* Featured Video */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 className="section-title" style={{ marginBottom: '2rem' }}>Featured</h2>
                    <div style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        overflow: 'hidden'
                    }}>
                        <video
                            controls
                            poster="/projects/2024-02_Wishtrend_Bakuchiol_Line/Model Ayo 01.jpg"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                            Wishtrend Bakuchiol Line — Behind the Scenes
                        </h3>
                        <p className="body-text" style={{ color: 'var(--secondary)' }}>
                            Commercial campaign for Wishtrend's Bakuchiol skincare line, 2024
                        </p>
                    </div>
                </section>

                {/* Photo Gallery */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 className="section-title" style={{ marginBottom: '2rem' }}>Gallery</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem'
                    }}>
                        {galleryImages.map((img, i) => (
                            <div
                                key={i}
                                style={{
                                    position: 'relative',
                                    aspectRatio: '1/1',
                                    overflow: 'hidden'
                                }}
                            >
                                <Image
                                    src={img}
                                    alt={`Gallery image ${i + 1}`}
                                    fill
                                    style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Social Links */}
                <section style={{
                    textAlign: 'center',
                    padding: '4rem 0',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    marginBottom: '4rem'
                }}>
                    <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Follow Along</h2>
                    <p className="body-text" style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
                        Stay updated with the latest content and behind-the-scenes
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                        <a
                            href="https://www.instagram.com/ayomid_night/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '1rem 2rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--foreground)',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Instagram size={20} />
                            <span>Instagram</span>
                        </a>
                        <a
                            href="https://www.tiktok.com/@ayomidknight"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '1rem 2rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--foreground)',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <TikTokIcon />
                            <span>TikTok</span>
                        </a>
                    </div>
                </section>

                {/* Music Section Placeholder */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 className="section-title" style={{ marginBottom: '2rem' }}>Music</h2>
                    <div style={{
                        padding: '4rem',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        textAlign: 'center'
                    }}>
                        <p className="body-text" style={{ color: 'var(--secondary)', fontStyle: 'italic' }}>
                            New music coming soon. Subscribe to the newsletter for updates.
                        </p>
                    </div>
                </section>

            </div>
        </main>
    );
}
