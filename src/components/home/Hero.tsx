'use client';
import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.background}>
                <Image
                    src="/hero-bg.png"
                    alt="Textured Background"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>
            <div className={styles.gridOverlay} />

            <div className={styles.content}>
                <div className={styles.titleWrapper}>
                    <h1 className={styles.title}>
                        Ayomide <br /> Abolaji
                    </h1>
                </div>

                <p className={styles.tagline}>
                    "Who says I've got to move hasty? I'd rather take it easy. I know I'm in my own lane so I choose to set my own pace."
                </p>
            </div>

            <div className={styles.modelImageContainer}>
                <Image
                    src="/projects/2019-04_Emmanuel_Photography/image00011.jpeg"
                    alt="Ayomide Abolaji Model Portrait"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>

            <div className={styles.metaContainer}>
                <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Role</span>
                    <span className={styles.metaValue}>Model / Musician / Poet</span>
                </div>
                <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Location</span>
                    <span className={styles.metaValue}>London, UK</span>
                </div>
                <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Height</span>
                    <span className={styles.metaValue}>180cm</span>
                </div>
            </div>

            <div className={styles.scrollIndicator}>
                <span>Scroll to Explore</span>
            </div>
        </section>
    );
}
