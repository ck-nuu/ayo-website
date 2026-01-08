import type { Metadata } from 'next';
import BookingForm from '@/components/forms/BookingForm';

export const metadata: Metadata = {
    title: 'Events & Bookings | Ayomide Abolaji',
    description: 'View upcoming events and submit booking requests for Ayomide Abolaji.',
};

// Placeholder data for events
const upcomingEvents = [
    { id: 1, date: 'TBA', title: 'Upcoming Appearances', location: 'London, UK' },
];

export default function EventsPage() {
    return (
        <main style={{ paddingTop: '120px', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
                <h1 className="display-text" style={{ marginBottom: '4rem', textAlign: 'center' }}>Events & Bookings</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>

                    {/* Left Column: Upcoming Events */}
                    <div>
                        <h2 className="section-title" style={{ marginBottom: '2rem' }}>Upcoming</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {upcomingEvents.map(event => (
                                <div key={event.id} style={{
                                    padding: '2rem',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.02)'
                                }}>
                                    <span style={{
                                        display: 'block',
                                        fontSize: '0.9rem',
                                        color: 'var(--primary)',
                                        marginBottom: '0.5rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em'
                                    }}>
                                        {event.date}
                                    </span>
                                    <h3 style={{
                                        fontFamily: 'var(--font-serif)',
                                        fontSize: '1.5rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {event.title}
                                    </h3>
                                    <span style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>
                                        {event.location}
                                    </span>
                                </div>
                            ))}

                            <p className="body-text" style={{ color: 'var(--secondary)', fontStyle: 'italic' }}>
                                More dates to be announced soon.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Booking Form */}
                    <div>
                        <h2 className="section-title" style={{ marginBottom: '2rem' }}>Book Ayomide</h2>
                        <p className="body-text" style={{ marginBottom: '2rem', color: 'var(--secondary)' }}>
                            Available for modeling, poetry performances, speaking engagements, and creative collaborations.
                        </p>
                        <BookingForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
