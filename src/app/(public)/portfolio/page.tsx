import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
    title: 'Portfolio | Ayomide Abolaji',
    description: 'Explore the portfolio of Ayomide Abolaji featuring editorial, commercial, and campaign work in modeling and photography.',
};

async function getPortfolioWithImages() {
    const supabase = await createClient();

    // Fetch all portfolio items
    const { data: items, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('year', { ascending: false });

    if (error || !items) {
        console.error('Error fetching portfolio:', error);
        return [];
    }

    // Fetch images for each item
    const itemsWithImages = await Promise.all(
        items.map(async (item) => {
            const { data: images } = await supabase
                .from('portfolio_images')
                .select('image_url')
                .eq('portfolio_id', item.id)
                .order('sort_order', { ascending: true });

            return {
                id: item.id,
                title: item.title,
                discipline: item.discipline,
                subcategory: item.subcategory,
                year: item.year,
                image: item.image_url, // cover image
                link: item.link,
                galleryImages: images?.map(i => i.image_url) || []
            };
        })
    );

    return itemsWithImages;
}

export default async function PortfolioPage() {
    const projects = await getPortfolioWithImages();
    return <PortfolioClient projects={projects} />;
}
