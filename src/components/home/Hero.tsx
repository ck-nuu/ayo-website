'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './Hero.module.css';

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
            type: "spring" as const, // Explicit cast
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
            ease: "circOut", // Simplified to string
            delay: 0.2,
        },
    },
} as const;

export default function Hero() {
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
                        <motion.span style={{ display: 'block' }} variants={itemVariants}>Ayomide</motion.span>
                        <motion.span style={{ display: 'block' }} variants={itemVariants}>Abolaji</motion.span>
                    </motion.h1>
                </div>

                <motion.p className={styles.tagline} variants={itemVariants}>
                    "Who says I've got to move hasty? I'd rather take it easy. I know I'm in my own lane so I choose to set my own pace."
                </motion.p>
            </motion.div>

            <motion.div
                className={styles.modelImageContainer}
                initial="hidden"
                animate="visible"
                variants={imageVariants}
            >
                <Image
                    src="/projects/2019-04_Emmanuel_Photography/image00011.jpeg"
                    alt="Ayomide Abolaji Model Portrait"
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
