import type { Metadata } from 'next';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = {
    title: 'Contact | Ayomide Abolaji',
    description: 'Get in touch with Ayomide Abolaji for bookings, collaborations, or inquiries.',
};

export default function ContactPage() {
    return (
        <main style={{ paddingTop: '120px', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
                    <h1 className="display-text" style={{ marginBottom: '2rem' }}>Get in Touch</h1>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
                        <div>
                            <p className="body-text" style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>
                                For bookings, collaborations, or general inquiries, please use the form or email directly.
                            </p>
                            <a
                                href="mailto:ayomideabolaji.inc+website@gmail.com"
                                className="body-text"
                                style={{ color: 'var(--primary)', textDecoration: 'none', display: 'block', marginBottom: '2rem' }}
                            >
                                ayomideabolaji.inc+website@gmail.com
                            </a>

                            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Socials</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <a href="https://instagram.com/ayomideabolaji" target="_blank" style={{ color: 'var(--secondary)' }}>Instagram</a>
                                <a href="https://tiktok.com/@ayomideabolaji" target="_blank" style={{ color: 'var(--secondary)' }}>TikTok</a>
                                <a href="https://linkedin.com/in/ayomideabolaji" target="_blank" style={{ color: 'var(--secondary)' }}>LinkedIn</a>
                            </div>
                        </div>

                        <div>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
