'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProjectGalleryModal from '@/components/ProjectGalleryModal';

type Discipline = 'Modelling' | 'Music' | 'Poetry';

interface Project {
    id: string;
    title: string;
    discipline: Discipline;
    subcategory: string;
    year: string;
    image: string;
}

// Portfolio projects data
const projects: Project[] = [
    // Modelling - Commercial/E-com (formerly Commercial & Campaign)
    {
        id: 'wishtrend-2024',
        title: 'Wishtrend Bakuchiol Line',
        discipline: 'Modelling',
        subcategory: 'Commercial/E-com',
        year: '2024',
        image: '/projects/2024-02_Wishtrend_Bakuchiol_Line/Model Ayo 01.jpg',
    },
    {
        id: 'queen-slim-2020',
        title: 'Queen & Slim "We Are Here"',
        discipline: 'Modelling',
        subcategory: 'Commercial/E-com',
        year: '2020',
        image: '/projects/2020-01_Queen_&_Slim_We_Are_Here/Q&S-WAH-G1-1.jpg',
    },
    // Modelling - Editorial
    {
        id: 'new-wave-2024',
        title: 'New Wave Mag x Galacta Ag',
        discipline: 'Modelling',
        subcategory: 'Editorial',
        year: '2024',
        image: '/projects/2024-05_New_Wave_Mag_and_Galacta_Ag/39.jpg',
    },
    {
        id: 'we-gang-young-2023',
        title: 'We Gang Young',
        discipline: 'Modelling',
        subcategory: 'Editorial',
        year: '2023',
        image: '/projects/2023-11_We_Gang_Young/temp_1716670074768.619391964.jpeg',
    },
    {
        id: 'chae-jiwon-2023',
        title: 'Chae Jiwon Photography',
        discipline: 'Modelling',
        subcategory: 'Editorial',
        year: '2023',
        image: '/projects/2023-10_Chae_Jiwon_Photography_(최지원)/AY5A9400.jpg',
    },
    {
        id: 'kiuna-kim-2023',
        title: 'Kiuna Kim Photography',
        discipline: 'Modelling',
        subcategory: 'Editorial',
        year: '2023',
        image: '/projects/2023-05_Kiuna_Kim_Photography/ayo-15.jpg',
    },
    {
        id: 'tune-zine-2023',
        title: 'TUNE Zine',
        discipline: 'Modelling',
        subcategory: 'Editorial',
        year: '2023',
        image: '/projects/2023-03_TUNE_zine/IMG_20230312_131037.jpg',
    },
    {
        id: 'sam-marvell-2019',
        title: 'Sam Marvell Photography',
        discipline: 'Modelling',
        subcategory: 'Beauty',
        year: '2019',
        image: '/projects/2019-12_Sam_Marvell_Photography/Afrodite.jpg',
    },
    {
        id: 'cat-norris-2019',
        title: 'Cat Norris',
        discipline: 'Modelling',
        subcategory: 'Beauty',
        year: '2019',
        image: '/projects/2019-09_Cat_Norris/IMG_20190923_154803.jpg',
    },
    {
        id: 'vague-2019',
        title: 'VAGUE Presents',
        discipline: 'Modelling',
        subcategory: 'Editorial',
        year: '2019',
        image: '/projects/2019-07_VAGUE_presents/VAGUE presents Judah virtual exhibition 11.png',
    },
    {
        id: 'katie-maddren-2019',
        title: 'Katie Maddren',
        discipline: 'Modelling',
        subcategory: 'Editorial',
        year: '2019',
        image: '/projects/2019-05_Katie_Maddren/KATIE_M_MP_05_0534_FINAL.jpg',
    },
    {
        id: 'emmanuel-2019',
        title: 'Emmanuel Photography',
        discipline: 'Modelling',
        subcategory: 'Editorial',
        year: '2019',
        image: '/projects/2019-04_Emmanuel_Photography/image00011.jpeg',
    },
    // Music
    {
        id: 'music-sample-1',
        title: 'Original Composition',
        discipline: 'Music',
        subcategory: 'Lead',
        year: '2024',
        image: '/projects/2023-05_Kiuna_Kim_Photography/ayo-15.jpg', // Placeholder
    },
    {
        id: 'maizani-slow-2023',
        title: 'Slow (feat. AYO) - Maizani',
        discipline: 'Music',
        subcategory: 'Features',
        year: '2023',
        image: '/projects/2023-05_Kiuna_Kim_Photography/ayo-15.jpg', // Placeholder
    },
    // Poetry (Placeholders)
    {
        id: 'poetry-sample-1',
        title: 'Selected Works Vol. 1',
        discipline: 'Poetry',
        subcategory: 'Selected Works',
        year: '2023',
        image: '/projects/2019-12_Sam_Marvell_Photography/image00001.jpeg', // Placeholder
    },
    {
        id: 'poetry-sample-2',
        title: 'Spoken Word Performance',
        discipline: 'Poetry',
        subcategory: 'Voice',
        year: '2024',
        image: '/projects/2023-11_We_Gang_Young/image00001.jpeg', // Placeholder
    }
];

const taxonomy = {
    Modelling: ['All', 'Editorial', 'Commercial/E-com', 'Beauty'],
    Music: ['All', 'Features', 'Lead'],
    Poetry: ['All', 'Published', 'Selected Works', 'Voice'],
};

export default function PortfolioClient() {
    const [activeDiscipline, setActiveDiscipline] = useState<Discipline>('Modelling');
    const [activeSubcategory, setActiveSubcategory] = useState('All');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDisciplineChange = (discipline: Discipline) => {
        setActiveDiscipline(discipline);
        setActiveSubcategory('All'); // Reset subcategory when switching discipline
    };

    const filteredProjects = projects.filter(project => {
        const matchesDiscipline = project.discipline === activeDiscipline;
        const matchesSubcategory = activeSubcategory === 'All' || project.subcategory === activeSubcategory;
        return matchesDiscipline && matchesSubcategory;
    });

    return (
        <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 className="display-text" style={{ marginBottom: '1rem' }}>Portfolio</h1>
                    <p className="body-text" style={{ color: 'var(--secondary)' }}>
                        Selected works across disciplines
                    </p>
                </div>

                {/* Level 1: Discipline Tabs */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '3rem',
                    marginBottom: '2rem',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '1rem'
                }}>
                    {(Object.keys(taxonomy) as Discipline[]).map((discipline) => (
                        <button
                            key={discipline}
                            onClick={() => handleDisciplineChange(discipline)}
                            className="uppercase-tracking"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: activeDiscipline === discipline ? 'var(--primary)' : 'var(--secondary)',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                position: 'relative',
                                opacity: activeDiscipline === discipline ? 1 : 0.6,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {discipline}
                            {activeDiscipline === discipline && (
                                <span style={{
                                    position: 'absolute',
                                    bottom: '-1rem', // Aligns with the border-bottom of the container
                                    left: 0,
                                    width: '100%',
                                    height: '2px',
                                    background: 'var(--primary)'
                                }} />
                            )}
                        </button>
                    ))}
                </div>

                {/* Level 2: Subcategory Filters */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
                    {taxonomy[activeDiscipline].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveSubcategory(cat)}
                            style={{
                                background: activeSubcategory === cat ? 'var(--foreground)' : 'transparent',
                                color: activeSubcategory === cat ? 'var(--background)' : 'var(--secondary)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '0.4rem 1.2rem',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                borderRadius: '20px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                {filteredProjects.length > 0 ? (
                    <motion.div
                        key={`${activeDiscipline}-${activeSubcategory}`}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', // Responsive 3-col logic
                            gap: '2rem',
                            marginBottom: '6rem'
                        }}
                    >
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                variants={{
                                    hidden: { opacity: 0, y: 50 },
                                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
                                }}
                                onClick={() => {
                                    setSelectedProject(project);
                                    setIsModalOpen(true);
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setSelectedProject(project);
                                        setIsModalOpen(true);
                                    }
                                }}
                                className="group" // For hover effects
                                style={{
                                    position: 'relative',
                                    aspectRatio: '16/10', // Landscape: "Long side at bottom"
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    borderRadius: '16px', // Rounded corners
                                    background: 'rgba(255,255,255,0.02)',
                                    isolation: 'isolate'
                                }}
                            >
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="group-hover:scale-105 transition-transform duration-700 ease-out"
                                    style={{ objectFit: 'cover' }}
                                />

                                {/* Overlay Gradient - Always visible at bottom but subtle */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    top: '40%', // Start gradient further down
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                                    zIndex: 2,
                                    pointerEvents: 'none'
                                }} />

                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: '1.5rem',
                                    zIndex: 3
                                }}>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        color: 'var(--primary)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        opacity: 0.9
                                    }}>
                                        {project.subcategory}
                                    </span>
                                    <h3 style={{
                                        fontFamily: 'var(--font-serif)',
                                        fontSize: '1.25rem',
                                        color: '#fff',
                                        margin: 0,
                                        lineHeight: 1.2
                                    }}>
                                        {project.title}
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--secondary)' }}>
                        <p>No projects found in this category yet.</p>
                    </div>
                )}

                {selectedProject && (
                    <ProjectGalleryModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        project={selectedProject}
                    />
                )}

                {/* CTA */}
                <section style={{ textAlign: 'center', padding: '4rem 0', borderTop: '1px solid var(--border-color)' }}>
                    <h2 className="section-title" style={{ marginBottom: '1rem' }}>Interested in Collaborating?</h2>
                    <p className="body-text" style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
                        Open to projects across modelling, music, and poetry
                    </p>
                    <Link
                        href="/contact"
                        className="uppercase-tracking"
                        style={{
                            display: 'inline-block',
                            padding: '1rem 2rem',
                            background: 'var(--foreground)',
                            color: 'var(--background)',
                            textDecoration: 'none',
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
