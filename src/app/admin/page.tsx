import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

async function getStats() {
    const supabase = await createClient();

    const [contacts, bookings, subscribers] = await Promise.all([
        supabase.from('contacts').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('subscribers').select('*', { count: 'exact', head: true }),
    ]);

    return {
        contacts: contacts.count || 0,
        bookings: bookings.count || 0,
        subscribers: subscribers.count || 0,
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const cards = [
        { label: 'Contact Messages', count: stats.contacts, href: '/admin/contacts', color: '#3b82f6' },
        { label: 'Booking Requests', count: stats.bookings, href: '/admin/bookings', color: '#8b5cf6' },
        { label: 'Newsletter Subscribers', count: stats.subscribers, href: '/admin/subscribers', color: '#10b981' },
    ];

    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>
                Dashboard
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {cards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        style={{
                            padding: '2rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            color: card.color
                        }}>
                            {card.count}
                        </div>
                        <div style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>
                            {card.label}
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1rem' }}>Quick Actions</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/" target="_blank" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>
                        View Public Site →
                    </Link>
                </div>
            </div>
        </div>
    );
}
