'use client';

import { useState } from 'react';
import HeroForm from '@/components/admin/HeroForm';
import AboutForm from '@/components/admin/AboutForm';
import {
    HeroContent,
    AboutIntroContent,
    AboutDisciplinesContent,
    AboutExperienceContent,
    AboutCtaContent
} from './actions';

interface SiteContentClientProps {
    heroData: HeroContent | null;
    aboutIntroData: AboutIntroContent | null;
    aboutDisciplinesData: AboutDisciplinesContent | null;
    aboutExperienceData: AboutExperienceContent | null;
    aboutCtaData: AboutCtaContent | null;
}

type TabKey = 'hero' | 'about';

export default function SiteContentClient({
    heroData,
    aboutIntroData,
    aboutDisciplinesData,
    aboutExperienceData,
    aboutCtaData
}: SiteContentClientProps) {
    const [activeTab, setActiveTab] = useState<TabKey>('hero');

    const tabs: { key: TabKey; label: string }[] = [
        { key: 'hero', label: 'Hero Banner' },
        { key: 'about', label: 'About Page' }
    ];

    return (
        <div>
            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '0',
                marginBottom: '2rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: '1rem 2rem',
                            background: activeTab === tab.key ? 'rgba(255,255,255,0.05)' : 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === tab.key ? 'var(--foreground)' : 'var(--secondary)',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: activeTab === tab.key ? 600 : 400,
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'hero' && (
                <HeroForm initialData={heroData} />
            )}

            {activeTab === 'about' && (
                <AboutForm
                    introData={aboutIntroData}
                    disciplinesData={aboutDisciplinesData}
                    experienceData={aboutExperienceData}
                    ctaData={aboutCtaData}
                />
            )}
        </div>
    );
}
