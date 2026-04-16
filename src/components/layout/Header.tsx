'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Media', href: '/media' },
    { label: 'Blog', href: '/blog' },
    { label: 'Events', href: '/events' },
    { label: 'Contact', href: '/contact' },
];

export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

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
                            src="/logos/5.png"
                            alt="Ayomide Abolaji Logo"
                            width={400}
                            height={200}
                            priority
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </Link>

                <div className={styles.navRight}>
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

                    <button 
                        className={styles.mobileMenuBtn} 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <ul className={styles.mobileNavLinks}>
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${styles.mobileNavLink} ${pathname === item.href ? styles.active : ''}`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
}
