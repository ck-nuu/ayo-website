import PortfolioForm from '@/components/admin/PortfolioForm';
import { getPortfolioItemWithImages } from '@/app/admin/portfolio/actions';
import { notFound } from 'next/navigation';

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const item = await getPortfolioItemWithImages(id);

    if (!item) {
        notFound();
    }

    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>
                Edit Project
            </h1>
            <PortfolioForm initialData={item} />
        </div>
    );
}
