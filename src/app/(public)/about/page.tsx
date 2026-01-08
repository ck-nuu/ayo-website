import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'About | Ayomide Abolaji',
    description: 'Learn about Ayomide Abolaji - a London-based model, singer, and poet blending creative disciplines with authentic perspective.',
};

export default function AboutPage() {
    return (
        <main style={{ paddingTop: '120px', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>

                {/* Hero Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '6rem', alignItems: 'center' }}>
                    <div>
                        <h1 className="display-text" style={{ marginBottom: '2rem' }}>About</h1>
                        <p className="body-text" style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--secondary)', marginBottom: '2rem' }}>
                            Ayomide Abolaji is a London-based model, singer, and poet. With a unique blend of creative disciplines,
                            Ayomide brings an authentic and multifaceted perspective to every project.
                        </p>
                        <p className="body-text" style={{ lineHeight: 1.8, color: 'var(--secondary)' }}>
                            "Who says I've got to move hasty? I'd rather take it easy. I know I'm in my own lane so I choose to set my own pace."
                        </p>
                    </div>
                    <div style={{ position: 'relative', height: '500px' }}>
                        <Image
                            src="/projects/2023-05_Kiuna_Kim_Photography/image00001.jpeg"
                            alt="Ayomide Abolaji Portrait"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>

                {/* Disciplines */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 className="section-title" style={{ marginBottom: '3rem', textAlign: 'center' }}>Disciplines</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        {[
                            { title: 'Modeling', description: 'Editorial, commercial, and runway work with brands and publications across London and internationally.' },
                            { title: 'Music', description: 'A versatile vocalist exploring R&B, soul, and contemporary sounds. Known for emotive performances and original compositions.' },
                            { title: 'Poetry', description: 'Spoken word and written poetry that explores identity, culture, and the human experience with lyrical depth.' },
                        ].map((item) => (
                            <div key={item.title} style={{
                                padding: '2rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.02)'
                            }}>
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1rem' }}>
                                    {item.title}
                                </h3>
                                <p className="body-text" style={{ color: 'var(--secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Experience Highlights */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 className="section-title" style={{ marginBottom: '3rem' }}>Experience</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { year: '2024', title: 'Wishtrend Bakuchiol Line Campaign' },
                            { year: '2024', title: 'New Wave Mag x Galacta Ag' },
                            { year: '2023', title: 'We Gang Young Editorial' },
                            { year: '2023', title: 'TUNE Zine Feature' },
                            { year: '2023', title: 'Chae Jiwon Photography Seoul' },
                            { year: '2020', title: 'Queen & Slim "We Are Here" Campaign' },
                            { year: '2019', title: 'VAGUE Presents Editorial' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem 0',
                                borderBottom: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>{item.title}</span>
                                <span style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{item.year}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact CTA */}
                <section style={{ textAlign: 'center', padding: '4rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 className="section-title" style={{ marginBottom: '1rem' }}>Let's Work Together</h2>
                    <p className="body-text" style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
                        For bookings, collaborations, or inquiries
                    </p>
                    <a
                        href="/contact"
                        style={{
                            display: 'inline-block',
                            padding: '1rem 2rem',
                            background: 'var(--foreground)',
                            color: 'var(--background)',
                            textDecoration: 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}
                    >
                        Get in Touch
                    </a>
                </section>

            </div>
        </main>
    );
}
