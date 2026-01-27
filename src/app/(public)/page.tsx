import Hero from "@/components/home/Hero";
import Timeline from "@/components/home/Timeline";
import { createClient } from "@/utils/supabase/server";

async function getFeaturedProjects() {
    const supabase = await createClient();

    // Fetch portfolio items, ordered by year descending, limit to recent projects
    const { data: items, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('year', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);

    if (error || !items) {
        console.error('Error fetching featured projects:', error);
        return [];
    }

    // Fetch images for each item
    const projectsWithImages = await Promise.all(
        items.map(async (item) => {
            const { data: images } = await supabase
                .from('portfolio_images')
                .select('image_url')
                .eq('portfolio_id', item.id)
                .order('sort_order', { ascending: true });

            // Format date from year
            const date = item.year;

            return {
                date,
                title: item.title,
                role: item.association || `${item.discipline} / ${item.subcategory}`,
                link: item.link || '#',
                image: item.image_url,
                galleryImages: images?.map(i => i.image_url) || []
            };
        })
    );

    return projectsWithImages;
}

export default async function Home() {
    const projects = await getFeaturedProjects();

    return (
        <main>
            <Hero />
            <Timeline projects={projects} />
        </main>
    );
}
