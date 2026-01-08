import { createClient } from '@/utils/supabase/server';

async function getContacts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching contacts:', error);
        return [];
    }
    return data || [];
}

export default async function ContactsPage() {
    const contacts = await getContacts();

    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>
                Contact Messages
            </h1>

            {contacts.length === 0 ? (
                <p style={{ color: 'var(--secondary)' }}>No contact messages yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            style={{
                                padding: '1.5rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div>
                                    <strong style={{ fontSize: '1.1rem' }}>{contact.name}</strong>
                                    <span style={{ color: 'var(--secondary)', marginLeft: '1rem', fontSize: '0.9rem' }}>
                                        {contact.email}
                                    </span>
                                </div>
                                <span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>
                                    {new Date(contact.created_at).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <p style={{ color: 'var(--foreground)', lineHeight: 1.6 }}>
                                {contact.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
