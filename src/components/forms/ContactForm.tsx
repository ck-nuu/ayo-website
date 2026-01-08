'use client';

import { useState } from 'react';
import { submitContactForm } from '@/app/actions';
import styles from './Forms.module.css';

export default function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(formData: FormData) {
        setStatus('submitting');
        setMessage('');

        const result = await submitContactForm(formData);

        if (result?.error) {
            setStatus('error');
            setMessage(result.error);
        } else {
            setStatus('success');
            setMessage(result?.success || 'Message sent!');
            // Optional: reset form
            const form = document.querySelector('form') as HTMLFormElement;
            form?.reset();
        }
    }

    return (
        <form action={handleSubmit} className={styles.form}>
            <div className={styles.group}>
                <label htmlFor="name" className={styles.label}>Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className={styles.input}
                    placeholder="Your full name"
                />
            </div>

            <div className={styles.group}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className={styles.input}
                    placeholder="your@email.com"
                    suppressHydrationWarning={true}
                />
            </div>

            <div className={styles.group}>
                <label htmlFor="message" className={styles.label}>Message</label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className={styles.textarea}
                    placeholder="How can we collaborate?"
                />
            </div>

            <button
                type="submit"
                disabled={status === 'submitting'}
                className={styles.submitButton}
            >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>

            {message && (
                <p className={`${styles.feedback} ${status === 'error' ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}
        </form>
    );
}
