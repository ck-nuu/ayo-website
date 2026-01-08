import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

async function getBookings() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
    return data || [];
}

async function updateBookingStatus(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const id = formData.get('id') as string;
    const status = formData.get('status') as string;

    await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

    revalidatePath('/admin/bookings');
}

const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    confirmed: '#10b981',
    declined: '#ef4444',
    completed: '#6b7280',
};

export default async function BookingsPage() {
    const bookings = await getBookings();

    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>
                Booking Requests
            </h1>

            {bookings.length === 0 ? (
                <p style={{ color: 'var(--secondary)' }}>No booking requests yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            style={{
                                padding: '1.5rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <strong style={{ fontSize: '1.1rem' }}>{booking.name}</strong>
                                    <span style={{ color: 'var(--secondary)', marginLeft: '1rem', fontSize: '0.9rem' }}>
                                        {booking.email}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{
                                        padding: '0.3rem 0.8rem',
                                        background: `${statusColors[booking.status]}20`,
                                        color: statusColors[booking.status],
                                        fontSize: '0.8rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <span style={{ color: 'var(--secondary)', fontSize: '0.8rem', display: 'block' }}>Event Type</span>
                                    <span>{booking.event_type}</span>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--secondary)', fontSize: '0.8rem', display: 'block' }}>Date</span>
                                    <span>{booking.event_date || 'TBD'}</span>
                                </div>
                            </div>

                            {booking.message && (
                                <p style={{ color: 'var(--foreground)', lineHeight: 1.6, marginBottom: '1rem' }}>
                                    {booking.message}
                                </p>
                            )}

                            <form action={updateBookingStatus} style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="hidden" name="id" value={booking.id} />
                                <select
                                    name="status"
                                    defaultValue={booking.status}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'var(--foreground)',
                                        padding: '0.5rem',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="declined">Declined</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <button
                                    type="submit"
                                    style={{
                                        background: 'var(--foreground)',
                                        color: 'var(--background)',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Update
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
