import type { Metadata } from 'next';

import { Instagram } from 'lucide-react';
import SocialFeeds from './SocialFeeds';

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

const PinterestIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
    >
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.487-.69-2.435-2.853-2.435-4.589 0-3.797 2.75-7.29 7.923-7.29 4.15 0 7.377 2.962 7.377 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" />
    </svg>
);

// Sample video from Wishtrend project
const videoUrl = '/projects/2024-02_Wishtrend_Bakuchiol_Line/WhatsApp Video 2024-02-26 at 15.22.03.mp4';

// Gallery images for the media page


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



                <SocialFeeds />

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
                        <a
                            href="https://www.pinterest.co.uk/ayomideabolaji/"
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
                            <PinterestIcon />
                            <span>Pinterest</span>
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
