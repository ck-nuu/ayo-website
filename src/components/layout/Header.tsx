'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Media', href: '/media' },
    { label: 'Events', href: '/events' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
];

export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <div className={styles.logoImageWrapper}>
                        <Image
                            src="/logos/logo-white-text.png"
                            alt="Ayomide Abolaji Logo"
                            width={240}
                            height={120}
                            priority
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </Link>

                <nav className={styles.nav}>
                    <ul className={styles.navLinks}>
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <Link href="/contact" className={styles.cta}>
                    Let's Talk
                </Link>
            </div>
        </header>
    );
}
