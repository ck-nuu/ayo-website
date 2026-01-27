import { getSiteContent, HeroContent } from '@/app/admin/site-content/actions';
import HeroClient from './HeroClient';

// Default values as fallback
const defaultHero: HeroContent = {
    title_line1: 'Ayomide',
    title_line2: 'Abolaji',
    tagline: '"Who says I\'ve got to move hasty? I\'d rather take it easy. I know I\'m in my own lane so I choose to set my own pace."',
    image_url: '/projects/2019-04_Emmanuel_Photography/image00011.jpeg'
};

export default async function Hero() {
    const heroData = await getSiteContent<HeroContent>('hero');
    const content = heroData || defaultHero;

    return (
        <HeroClient
            titleLine1={content.title_line1}
            titleLine2={content.title_line2}
            tagline={content.tagline}
            imageUrl={content.image_url}
        />
    );
}
