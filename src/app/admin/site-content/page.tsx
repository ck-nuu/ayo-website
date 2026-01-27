import {
    getSiteContent,
    HeroContent,
    AboutIntroContent,
    AboutDisciplinesContent,
    AboutExperienceContent,
    AboutCtaContent
} from './actions';
import SiteContentClient from './SiteContentClient';

export default async function SiteContentPage() {
    // Fetch all content in parallel
    const [heroData, aboutIntroData, aboutDisciplinesData, aboutExperienceData, aboutCtaData] = await Promise.all([
        getSiteContent<HeroContent>('hero'),
        getSiteContent<AboutIntroContent>('about_intro'),
        getSiteContent<AboutDisciplinesContent>('about_disciplines'),
        getSiteContent<AboutExperienceContent>('about_experience'),
        getSiteContent<AboutCtaContent>('about_cta')
    ]);

    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>
                Site Content
            </h1>
            <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
                Manage editable content for the homepage hero banner and about page.
            </p>

            <SiteContentClient
                heroData={heroData}
                aboutIntroData={aboutIntroData}
                aboutDisciplinesData={aboutDisciplinesData}
                aboutExperienceData={aboutExperienceData}
                aboutCtaData={aboutCtaData}
            />
        </div>
    );
}
