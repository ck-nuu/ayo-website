import type { Metadata } from 'next';
import Image from 'next/image';
import BlobImage from '@/components/BlobImage';
import styles from './About.module.css';
import {
    getSiteContent,
    AboutIntroContent,
    AboutDisciplinesContent,
    AboutExperienceContent,
    AboutCtaContent
} from '@/app/admin/site-content/actions';

export const metadata: Metadata = {
    title: 'About | Ayomide Abolaji',
    description: 'Learn about Ayomide Abolaji - a Lagos-born, London-raised, Lisbon-based poet, singer and model blending creative disciplines with authentic perspective.',
};

// Default content as fallback
const defaultIntro: AboutIntroContent = {
    heading: 'About',
    bio: 'Ayomide Abolaji is a Lagos-born, London-raised, Lisbon-based poet, singer and model. Working across disciplines with a devotion to expressive freedom, her practice is rooted in themes of identity, softness and becoming. Informed by a cross-cultural background, Ayomide offers a distinct perspective grounded in authenticity, adaptability, and a strong visual and narrative presence.',
    quote: '"Who says I\'ve got to move hasty? I\'d rather take it easy. I know I\'m in my own lane so I choose to set my own pace."',
    image_url: '/projects/2024-05_New_Wave_Mag_and_Galacta_Ag/37.jpg'
};

const defaultDisciplines: AboutDisciplinesContent = {
    items: [
        { title: 'Poetry', description: 'Spoken word and written poetry that explores identity, culture, and the human experience with lyrical depth.' },
        { title: 'Music', description: 'A versatile vocalist exploring R&B, soul, and contemporary sounds. Known for emotive performances and original compositions.' },
        { title: 'Modeling', description: 'Editorial, commercial, and runway work with brands and publications across London and internationally.' },
    ]
};

const defaultExperience: AboutExperienceContent = {
    items: [
        { year: '2024', title: 'Wishtrend Bakuchiol Line Campaign' },
        { year: '2024', title: 'New Wave Mag x Galacta Ag' },
        { year: '2023', title: 'We Gang Young Editorial' },
        { year: '2023', title: 'TUNE Zine Feature' },
        { year: '2023', title: 'Chae Jiwon Photography Seoul' },
        { year: '2020', title: 'Queen & Slim "We Are Here" Campaign' },
        { year: '2019', title: 'VAGUE Presents Editorial' },
    ]
};

const defaultCta: AboutCtaContent = {
    heading: "Let's Work Together",
    subtitle: 'For bookings, collaborations, or inquiries',
    button_text: 'Get in Touch',
    button_link: '/contact'
};

export default async function AboutPage() {
    // Fetch all content in parallel
    const [introData, disciplinesData, experienceData, ctaData] = await Promise.all([
        getSiteContent<AboutIntroContent>('about_intro'),
        getSiteContent<AboutDisciplinesContent>('about_disciplines'),
        getSiteContent<AboutExperienceContent>('about_experience'),
        getSiteContent<AboutCtaContent>('about_cta')
    ]);

    const intro = introData || defaultIntro;
    const disciplines = disciplinesData || defaultDisciplines;
    const experience = experienceData || defaultExperience;
    const cta = ctaData || defaultCta;

    return (
        <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Hero Section */}
                <div className={styles.hero}>
                    <div>
                        <h1 className="display-text" style={{ marginBottom: '2rem' }}>{intro.heading}</h1>
                        <p className="body-text" style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--secondary)', marginBottom: '2rem' }}>
                            {intro.bio}
                        </p>
                        <p className="body-text" style={{ lineHeight: 1.8, color: 'var(--secondary)' }}>
                            {intro.quote}
                        </p>
                    </div>
                    <div className={styles.heroImageWrapper}>
                        <BlobImage
                            src={intro.image_url}
                            alt="Ayomide Abolaji Portrait"
                        />
                    </div>
                </div>

                {/* Disciplines */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 className="section-title" style={{ marginBottom: '3rem', textAlign: 'center' }}>Disciplines</h2>
                    <div className={styles.disciplinesGrid}>
                        {disciplines.items.map((item) => (
                            <div key={item.title} className={styles.disciplineCard}>
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1rem' }}>
                                    {item.title}
                                </h3>
                                <p className="body-text" style={{ color: 'var(--secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Experience Highlights */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 className="section-title" style={{ marginBottom: '3rem' }}>Experience</h2>
                    <div className={styles.experienceList}>
                        {experience.items.map((item, i) => (
                            <div key={i} className={styles.experienceItem}>
                                <span className={styles.experienceTitle}>{item.title}</span>
                                <span className={styles.experienceYear}>{item.year}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact CTA */}
                <section className={styles.ctaSection}>
                    <h2 className="section-title" style={{ marginBottom: '1rem' }}>{cta.heading}</h2>
                    <p className="body-text" style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
                        {cta.subtitle}
                    </p>
                    <a
                        href={cta.button_link}
                        className={styles.ctaButton}
                    >
                        {cta.button_text}
                    </a>
                </section>

            </div>
        </main>
    );
}
