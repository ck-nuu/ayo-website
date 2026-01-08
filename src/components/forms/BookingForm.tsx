'use client';

import { useState } from 'react';
import { submitBookingRequest } from '@/app/actions';
import styles from './Forms.module.css';

export default function BookingForm() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(formData: FormData) {
        setStatus('submitting');
        setMessage('');

        const result = await submitBookingRequest(formData);

        if (result?.error) {
            setStatus('error');
            setMessage(result.error);
        } else {
            setStatus('success');
            setMessage(result?.success || 'Request sent!');
            const form = document.querySelector('form#booking-form') as HTMLFormElement;
            form?.reset();
        }
    }

    if (status === 'success') {
        return (
            <div className={styles.successWrapper}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem' }}>Request Received</h3>
                <p className="body-text">{message}</p>
                <button
                    onClick={() => setStatus('idle')}
                    className={styles.submitButton}
                    style={{ marginTop: '2rem' }}
                >
                    Send Another
                </button>
            </div>
        )
    }

    return (
        <form id="booking-form" action={handleSubmit} className={styles.form}>
            <div className={styles.group}>
                <label htmlFor="name" className={styles.label}>Name / Organization</label>
                <input type="text" id="name" name="name" required className={styles.input} />
            </div>

            <div className={styles.group}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input type="email" id="email" name="email" required className={styles.input} suppressHydrationWarning={true} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.group}>
                    <label htmlFor="event_type" className={styles.label}>Event Type</label>
                    <select id="event_type" name="event_type" required className={styles.input} style={{ appearance: 'none' }}>
                        <option value="">Select Type...</option>
                        <option value="speaking">Speaking Engagement</option>
                        <option value="performance">Performance (Music/Poetry)</option>
                        <option value="modeling">Modeling/Brand</option>
                        <option value="workshop">Workshop/Teaching</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className={styles.group}>
                    <label htmlFor="event_date" className={styles.label}>Date (Optional)</label>
                    <input type="date" id="event_date" name="event_date" className={styles.input} />
                </div>
            </div>

            <div className={styles.group}>
                <label htmlFor="message" className={styles.label}>Details</label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className={styles.textarea}
                    placeholder="Tell us about the event..."
                />
            </div>

            <button
                type="submit"
                disabled={status === 'submitting'}
                className={styles.submitButton}
            >
                {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
            </button>

            {status === 'error' && (
                <p className={`${styles.feedback} ${styles.error}`}>{message}</p>
            )}
        </form>
    );
}
