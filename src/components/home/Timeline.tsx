'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './Timeline.module.css';
import ProjectGalleryModal from '@/components/ProjectGalleryModal';

interface TimelineProject {
    date: string;
    title: string;
    role: string;
    link?: string | null;
    image: string;
    galleryImages?: string[];
}

interface TimelineProps {
    projects: TimelineProject[];
}

export default function Timeline({ projects }: TimelineProps) {
    const [selectedProject, setSelectedProject] = useState<TimelineProject | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProjectClick = (project: TimelineProject) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    if (projects.length === 0) {
        return null;
    }

    return (
        <section className={styles.timelineSection}>
            <h2 className={styles.sectionTitle}>Featured Projects</h2>

            <div className={styles.timelineGrid}>
                {projects.map((item, index) => (
                    <motion.div
                        key={index}
                        className={styles.item}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <span className={styles.date}>{item.date}</span>
                        <div className={styles.marker} />
                        <div className={styles.contentWrapper}>
                            <div
                                onClick={() => handleProjectClick(item)}
                                className={`${styles.content} cursor-pointer group`}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleProjectClick(item);
                                    }
                                }}
                            >
                                {item.image && (
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className={styles.hoverImage}
                                        sizes="(max-width: 768px) 100vw, 40vw"
                                    />
                                )}
                                <h3 className={styles.title}>{item.title}</h3>
                                <p className={styles.role}>{item.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {selectedProject && (
                <ProjectGalleryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    project={selectedProject}
                />
            )}
        </section>
    );
}
