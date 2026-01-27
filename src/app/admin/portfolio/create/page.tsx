import PortfolioForm from '@/components/admin/PortfolioForm';

export default function CreatePortfolioPage() {
    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>
                Create New Project
            </h1>
            <PortfolioForm />
        </div>
    );
}
