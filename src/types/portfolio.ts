export interface PortfolioItem {
    id: string;
    title: string;
    discipline: string;
    subcategory: string;
    year: string;
    image_url: string;
    link?: string | null;
    created_at: string;
    updated_at: string;
}

export interface PortfolioImage {
    id: string;
    portfolio_id: string;
    image_url: string;
    sort_order: number;
    created_at: string;
}

export interface PortfolioItemWithImages extends PortfolioItem {
    additional_images?: PortfolioImage[];
}
