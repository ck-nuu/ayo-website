import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';
import NewsletterForm from '@/components/forms/NewsletterForm';

const TikTokIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <Image
                            src="/logos/logo-white-text.png"
                            alt="Ayomide Abolaji Logo"
                            width={100}
                            height={35}
                            style={{ objectFit: 'contain' }}
                        />
                        <p className={styles.description}>
                            Model, Singer, and Poet. <br />
                            "Who says I've got to move hasty? I'd rather take it easy."
                        </p>
                    </div>

                    <div className={styles.linksColumn}>
                        <h4 className={styles.columnTitle}>Explore</h4>
                        <div className={styles.links}>
                            <Link href="/about" className={styles.link}>About</Link>
                            <Link href="/portfolio" className={styles.link}>Portfolio</Link>
                            <Link href="/media" className={styles.link}>Media</Link>
                            <Link href="/blog" className={styles.link}>Blog</Link>
                        </div>
                    </div>

                    <div className={styles.linksColumn}>
                        <h4 className={styles.columnTitle}>Connect</h4>
                        <div className={styles.links}>
                            <a href="https://www.instagram.com/ayomid_night/" target="_blank" rel="noopener noreferrer" className={styles.link}>Instagram</a>
                            <a href="https://www.tiktok.com/@ayomidknight" target="_blank" rel="noopener noreferrer" className={styles.link}>TikTok</a>
                            <a href="https://www.linkedin.com/in/ayomide-abolaji-624840199" target="_blank" rel="noopener noreferrer" className={styles.link}>LinkedIn</a>
                        </div>
                    </div>

                    <div className={styles.linksColumn}>
                        <h4 className={styles.columnTitle}>Newsletter</h4>
                        <p className={styles.description} style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
                            Stay updated with latest works and events.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© {currentYear} Ayomide Abolaji. All rights reserved.</p>
                    <div className={styles.socials}>
                        <a href="https://www.instagram.com/ayomid_night/" aria-label="Instagram">
                            <Instagram size={20} />
                        </a>
                        <a href="https://www.tiktok.com/@ayomidknight" aria-label="TikTok">
                            <TikTokIcon />
                        </a>
                        <a href="https://www.linkedin.com/in/ayomide-abolaji-624840199" aria-label="LinkedIn">
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
