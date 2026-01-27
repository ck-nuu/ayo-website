'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './Timeline.module.css';
import { timelineData } from './timelineData';
import ProjectGalleryModal from '@/components/ProjectGalleryModal';

export default function Timeline() {
    const [selectedProject, setSelectedProject] = useState<typeof timelineData[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProjectClick = (project: typeof timelineData[0]) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    return (
        <section className={styles.timelineSection}>
            <h2 className={styles.sectionTitle}>Featured Projects</h2>

            <div className={styles.timelineGrid}>
                {timelineData.map((item, index) => (
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
