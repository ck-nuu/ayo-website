import Link from 'next/link';
import Image from 'next/image';
import styles from './Timeline.module.css';
import { timelineData } from './timelineData';

export default function Timeline() {
    return (
        <section className={styles.timelineSection}>
            <h2 className={styles.sectionTitle}>Featured Projects</h2>

            <div className={styles.timelineGrid}>
                {timelineData.map((item, index) => (
                    <div key={index} className={styles.item}>
                        <span className={styles.date}>{item.date}</span>
                        <div className={styles.marker} />
                        <div className={styles.contentWrapper}>
                            <Link href={item.link} className={styles.content}>
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
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
