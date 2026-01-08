import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Portfolio | Ayomide Abolaji',
    description: 'Explore the portfolio of Ayomide Abolaji featuring editorial, commercial, and campaign work in modeling and photography.',
};

// Portfolio projects data based on available assets
const projects = [
    {
        id: 'wishtrend-2024',
        title: 'Wishtrend Bakuchiol Line',
        category: 'Commercial',
        year: '2024',
        image: '/projects/2024-02_Wishtrend_Bakuchiol_Line/Model Ayo 01.jpg',
    },
    {
        id: 'new-wave-2024',
        title: 'New Wave Mag x Galacta Ag',
        category: 'Editorial',
        year: '2024',
        image: '/projects/2024-05_New_Wave_Mag_and_Galacta_Ag/image00001.jpeg',
    },
    {
        id: 'we-gang-young-2023',
        title: 'We Gang Young',
        category: 'Editorial',
        year: '2023',
        image: '/projects/2023-11_We_Gang_Young/image00001.jpeg',
    },
    {
        id: 'chae-jiwon-2023',
        title: 'Chae Jiwon Photography',
        category: 'Editorial',
        year: '2023',
        image: '/projects/2023-10_Chae_Jiwon_Photography_(최지원)/image00001.jpeg',
    },
    {
        id: 'kiuna-kim-2023',
        title: 'Kiuna Kim Photography',
        category: 'Editorial',
        year: '2023',
        image: '/projects/2023-05_Kiuna_Kim_Photography/ayo-15.jpg',
    },
    {
        id: 'tune-zine-2023',
        title: 'TUNE Zine',
        category: 'Editorial',
        year: '2023',
        image: '/projects/2023-03_TUNE_zine/image00001.jpeg',
    },
    {
        id: 'queen-slim-2020',
        title: 'Queen & Slim "We Are Here"',
        category: 'Campaign',
        year: '2020',
        image: '/projects/2020-01_Queen_&_Slim_We_Are_Here/image00001.jpeg',
    },
    {
        id: 'sam-marvell-2019',
        title: 'Sam Marvell Photography',
        category: 'Editorial',
        year: '2019',
        image: '/projects/2019-12_Sam_Marvell_Photography/image00001.jpeg',
    },
    {
        id: 'cat-norris-2019',
        title: 'Cat Norris',
        category: 'Editorial',
        year: '2019',
        image: '/projects/2019-09_Cat_Norris/image00001.jpeg',
    },
    {
        id: 'vague-2019',
        title: 'VAGUE Presents',
        category: 'Editorial',
        year: '2019',
        image: '/projects/2019-07_VAGUE_presents/image00001.jpeg',
    },
    {
        id: 'katie-maddren-2019',
        title: 'Katie Maddren',
        category: 'Editorial',
        year: '2019',
        image: '/projects/2019-05_Katie_Maddren/image00001.jpeg',
    },
    {
        id: 'emmanuel-2019',
        title: 'Emmanuel Photography',
        category: 'Editorial',
        year: '2019',
        image: '/projects/2019-04_Emmanuel_Photography/image00011.jpeg',
    },
];

const categories = ['All', 'Editorial', 'Commercial', 'Campaign'];

export default function PortfolioPage() {
    return (
        <main style={{ paddingTop: '120px', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>

                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="display-text" style={{ marginBottom: '1rem' }}>Portfolio</h1>
                    <p className="body-text" style={{ color: 'var(--secondary)' }}>
                        Selected works in modeling, editorial, and commercial projects
                    </p>
                </div>

                {/* Category Filter (static for now) */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '4rem' }}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            style={{
                                background: cat === 'All' ? 'var(--foreground)' : 'transparent',
                                color: cat === 'All' ? 'var(--background)' : 'var(--secondary)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '0.6rem 1.5rem',
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.5rem',
                    marginBottom: '6rem'
                }}>
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            style={{
                                position: 'relative',
                                aspectRatio: '3/4',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                background: 'rgba(255,255,255,0.02)'
                            }}
                        >
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '2rem 1.5rem 1.5rem',
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                zIndex: 2
                            }}>
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--primary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    display: 'block',
                                    marginBottom: '0.3rem'
                                }}>
                                    {project.category} · {project.year}
                                </span>
                                <h3 style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '1.1rem'
                                }}>
                                    {project.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <section style={{ textAlign: 'center', padding: '4rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 className="section-title" style={{ marginBottom: '1rem' }}>Interested in Working Together?</h2>
                    <p className="body-text" style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
                        Available for editorial, commercial, and creative collaborations
                    </p>
                    <Link
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
                    </Link>
                </section>

            </div>
        </main>
    );
}
