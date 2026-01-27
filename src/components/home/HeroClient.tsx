'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './Hero.module.css';

interface HeroClientProps {
    titleLine1: string;
    titleLine2: string;
    tagline: string;
    imageUrl: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
} as const;

const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 70,
            damping: 20,
        },
    },
} as const;

const imageVariants = {
    hidden: { scale: 0.95, opacity: 0, y: '-45%', x: '-50%' },
    visible: {
        scale: 1,
        opacity: 1,
        y: '-50%',
        x: '-50%',
        transition: {
            duration: 1.2,
            ease: "circOut",
            delay: 0.2,
        },
    },
} as const;

export default function HeroClient({ titleLine1, titleLine2, tagline, imageUrl }: HeroClientProps) {
    return (
        <section className={styles.hero}>
            <div className={styles.background} />
            <div className={styles.noiseOverlay} />

            <motion.div
                className={styles.content}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className={styles.titleWrapper}>
                    <motion.h1 className={styles.title} variants={containerVariants}>
                        <motion.span style={{ display: 'block' }} variants={itemVariants}>{titleLine1}</motion.span>
                        <motion.span style={{ display: 'block' }} variants={itemVariants}>{titleLine2}</motion.span>
                    </motion.h1>
                </div>

                <motion.p className={styles.tagline} variants={itemVariants}>
                    {tagline}
                </motion.p>
            </motion.div>

            <motion.div
                className={styles.modelImageContainer}
                initial="hidden"
                animate="visible"
                variants={imageVariants}
            >
                <Image
                    src={imageUrl}
                    alt={`${titleLine1} ${titleLine2} Portrait`}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </motion.div>

            <motion.div
                className={styles.scrollIndicator}
                initial={{ opacity: 0, y: 20, x: '-50%' }}
                animate={{ opacity: 0.6, y: 0, x: '-50%' }}
                transition={{ delay: 1.5, duration: 1 }}
                whileHover={{ scale: 1.1, opacity: 1 }}
            >
                <span>Scroll to Explore</span>
            </motion.div>
        </section>
    );
}
