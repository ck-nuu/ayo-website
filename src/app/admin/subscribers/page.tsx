import { createClient } from '@/utils/supabase/server';

async function getSubscribers() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

    if (error) {
        console.error('Error fetching subscribers:', error);
        return [];
    }
    return data || [];
}

export default async function SubscribersPage() {
    const subscribers = await getSubscribers();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>
                    Newsletter Subscribers
                </h1>
                <span style={{ color: 'var(--secondary)' }}>
                    {subscribers.length} total
                </span>
            </div>

            {subscribers.length === 0 ? (
                <p style={{ color: 'var(--secondary)' }}>No subscribers yet.</p>
            ) : (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Email</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Subscribed</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((subscriber) => (
                                <tr key={subscriber.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{subscriber.email}</td>
                                    <td style={{ padding: '1rem', color: 'var(--secondary)', fontSize: '0.9rem' }}>
                                        {new Date(subscriber.subscribed_at).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem',
                                            background: subscriber.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                            color: subscriber.active ? '#10b981' : '#ef4444',
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase'
                                        }}>
                                            {subscriber.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>
                    💡 Export functionality coming soon. For now, you can export directly from the Supabase dashboard.
                </p>
            </div>
        </div>
    );
}
