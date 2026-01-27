import type { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
    title: 'Portfolio | Ayomide Abolaji',
    description: 'Explore the portfolio of Ayomide Abolaji featuring editorial, commercial, and campaign work in modeling and photography.',
};

export default function PortfolioPage() {
    return <PortfolioClient />;
}
