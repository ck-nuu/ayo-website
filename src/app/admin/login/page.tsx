'use client';

import { useState } from 'react';
import { login } from './actions';
import styles from '@/components/forms/Forms.module.css';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setError('');
        setLoading(true);

        const result = await login(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
        // If successful, the server action will redirect
    }

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--background)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '3rem',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.02)'
            }}>
                <h1 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    Admin Login
                </h1>

                <form action={handleSubmit} className={styles.form}>
                    <div className={styles.group}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className={styles.input}
                            suppressHydrationWarning={true}
                        />
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className={styles.input}
                        />
                    </div>

                    {error && (
                        <p className={`${styles.feedback} ${styles.error}`}>{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </main>
    );
}
