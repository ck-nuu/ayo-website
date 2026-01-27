import Link from 'next/link';
import Image from 'next/image';
import { getPortfolioItems, deletePortfolioItem } from './actions';
import { Trash2, Edit } from 'lucide-react';

export default async function PortfolioPage() {
    const items = await getPortfolioItems();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>
                    Portfolio
                </h1>
                <Link
                    href="/admin/portfolio/create"
                    style={{
                        padding: '0.8rem 1.5rem',
                        background: 'var(--foreground)',
                        color: 'var(--background)',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                    }}
                >
                    + Add New Project
                </Link>
            </div>

            {items.length === 0 ? (
                <p style={{ color: 'var(--secondary)' }}>No portfolio items yet.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {items.map((item: any) => (
                        <div
                            key={item.id}
                            style={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ position: 'relative', aspectRatio: '16/10', width: '100%' }}>
                                <Image
                                    src={item.image_url}
                                    alt={item.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{item.title}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{item.year}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                                    {item.discipline} / {item.subcategory}
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <Link
                                        href={`/admin/portfolio/${item.id}`}
                                        style={{
                                            padding: '0.5rem',
                                            color: 'var(--foreground)',
                                            opacity: 0.7,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Edit size={18} />
                                    </Link>

                                    <form action={async () => {
                                        'use server';
                                        await deletePortfolioItem(item.id, item.image_url);
                                    }}>
                                        <button
                                            type="submit"
                                            style={{
                                                padding: '0.5rem',
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        // Add simple confirm on client side? native verify?
                                        // Ideally use client component for delete to confirm, but this is simple admin v1
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
