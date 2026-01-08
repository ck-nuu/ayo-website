'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/admin/login/actions';
import styles from './AdminSidebar.module.css';

const navItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Contacts', href: '/admin/contacts' },
    { label: 'Bookings', href: '/admin/bookings' },
    { label: 'Subscribers', href: '/admin/subscribers' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
                    <Image
                        src="/logos/admin-logo.png"
                        alt="Ayomide Abolaji Logo"
                        width={200}
                        height={70}
                        style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                    />
                    <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--secondary)', marginTop: '0.5rem', textAlign: 'center' }}>Admin</span>
                </Link>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className={styles.footer}>
                <form action={logout}>
                    <button type="submit" className={styles.logoutButton}>
                        Sign Out
                    </button>
                </form>
            </div>
        </aside>
    );
}
