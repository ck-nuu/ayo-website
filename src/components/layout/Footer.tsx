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

const PinterestIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
    >
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.487-.69-2.435-2.853-2.435-4.589 0-3.797 2.75-7.29 7.923-7.29 4.15 0 7.377 2.962 7.377 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" />
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
                            Poet, Singer, and Model. <br />
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
                            <a href="https://www.pinterest.co.uk/ayomideabolaji/" target="_blank" rel="noopener noreferrer" className={styles.link}>Pinterest</a>
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
                        <a href="https://www.pinterest.co.uk/ayomideabolaji/" aria-label="Pinterest">
                            <PinterestIcon />
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
