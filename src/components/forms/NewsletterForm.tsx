'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/app/actions';
import styles from './Forms.module.css';

export default function NewsletterForm() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(formData: FormData) {
        // Reset status if retrying
        setStatus('submitting');
        setMessage('');

        // Client-side validation could go here
        const result = await subscribeNewsletter(formData);

        if (result?.error) {
            setStatus('error');
            setMessage(result.error);
        } else {
            setStatus('success');
            setMessage(result?.success || 'Subscribed!');
            const form = document.querySelector('form#newsletter-form') as HTMLFormElement;
            form?.reset();
        }
    }

    return (
        <form id="newsletter-form" action={handleSubmit} className={styles.newsletterForm}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email Address"
                        className={styles.input}
                        style={{ padding: '0.6rem', fontSize: '0.8rem', width: '200px' }}
                        disabled={status === 'success'}
                        suppressHydrationWarning={true}
                    />
                    <button
                        type="submit"
                        disabled={status === 'submitting' || status === 'success'}
                        className={styles.submitButton}
                        style={{ margin: 0, padding: '0.6rem 1rem', fontSize: '0.7rem' }}
                    >
                        {status === 'submitting' ? '...' : (status === 'success' ? '✓' : 'JOIN')}
                    </button>
                </div>

                {message && (
                    <span style={{
                        fontSize: '0.7rem',
                        color: status === 'error' ? '#f87171' : '#4ade80'
                    }}>
                        {message}
                    </span>
                )}
            </div>
        </form>
    );
}
