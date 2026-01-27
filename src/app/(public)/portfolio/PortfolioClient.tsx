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
    discipline: string;
    subcategory: string;
    year: string;
    image: string;
    link?: string | null;
    galleryImages?: string[];
}

interface PortfolioClientProps {
    projects: Project[];
}

const taxonomy = {
    Modelling: ['All', 'Editorial', 'Commercial/E-com', 'Beauty'],
    Music: ['All', 'Features', 'Lead'],
    Poetry: ['All', 'Published', 'Selected Works', 'Voice'],
};

export default function PortfolioClient({ projects }: PortfolioClientProps) {
    const [activeDiscipline, setActiveDiscipline] = useState<Discipline>('Modelling');
    const [activeSubcategory, setActiveSubcategory] = useState('All');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDisciplineChange = (discipline: Discipline) => {
        setActiveDiscipline(discipline);
        setActiveSubcategory('All');
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
                                    bottom: '-1rem',
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
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
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
                                className="group"
                                style={{
                                    position: 'relative',
                                    aspectRatio: '16/10',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
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

                                {/* Overlay Gradient */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    top: '40%',
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
