"use client";

import { InstagramEmbed } from 'react-social-media-embed';
import { useEffect, useState } from 'react';

export default function SocialFeeds() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const instagramPosts = [
        "https://www.instagram.com/ayomid_night/p/C32tMs-oO19/",
        "https://www.instagram.com/ayomid_night/p/CzbRqebspEv/",
        "https://www.instagram.com/ayomid_night/reel/CXgVHNPFRBg/"
    ];

    return (
        <>
            {/* Instagram Section */}
            <section style={{ marginBottom: '6rem' }}>
                <h2 className="section-title" style={{ marginBottom: '2rem' }}>Instagram</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    justifyItems: 'center'
                }}>
                    {instagramPosts.map((url, index) => (
                        <div key={index} style={{ width: '100%', maxWidth: '328px' }}>
                            <InstagramEmbed
                                url={url}
                                width={328}
                                captioned
                            />
                        </div>
                    ))}
                </div>
            </section>


        </>
    );
}
