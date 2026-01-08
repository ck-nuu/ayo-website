import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Blog | Ayomide Abolaji',
    description: 'Read the latest updates, thoughts on poetry and music, and behind-the-scenes stories from Ayomide Abolaji.',
};

// Placeholder blog posts (will be dynamic from Supabase later)
const posts = [
    {
        slug: 'new-beginnings-2024',
        title: 'New Beginnings in 2024',
        excerpt: 'Reflecting on the past year and looking forward to new creative projects and collaborations.',
        date: 'January 2024',
        image: '/projects/2024-02_Wishtrend_Bakuchiol_Line/Model Ayo 05.jpg',
        category: 'Updates'
    },
    {
        slug: 'wishtrend-campaign',
        title: 'Behind the Wishtrend Campaign',
        excerpt: 'A look behind the scenes of the Bakuchiol skincare campaign shoot in Seoul.',
        date: 'February 2024',
        image: '/projects/2024-02_Wishtrend_Bakuchiol_Line/Model Ayo 06.jpg',
        category: 'Work'
    },
    {
        slug: 'poetry-and-purpose',
        title: 'Poetry and Purpose',
        excerpt: 'Exploring the intersection of spoken word, identity, and creative expression.',
        date: 'December 2023',
        image: '/projects/2023-05_Kiuna_Kim_Photography/ayo-28.jpg',
        category: 'Thoughts'
    },
];

export default function BlogPage() {
    return (
        <main style={{ paddingTop: '120px', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>

                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="display-text" style={{ marginBottom: '1rem' }}>Blog</h1>
                    <p className="body-text" style={{ color: 'var(--secondary)' }}>
                        Thoughts, updates, and stories
                    </p>
                </div>

                {/* Featured Post */}
                {posts.length > 0 && (
                    <article style={{ marginBottom: '4rem' }}>
                        <div style={{
                            position: 'relative',
                            aspectRatio: '16/9',
                            marginBottom: '1.5rem',
                            overflow: 'hidden'
                        }}>
                            <Image
                                src={posts[0].image}
                                alt={posts[0].title}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--primary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}>
                            {posts[0].category} · {posts[0].date}
                        </span>
                        <h2 style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '2rem',
                            margin: '0.5rem 0 1rem'
                        }}>
                            {posts[0].title}
                        </h2>
                        <p className="body-text" style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>
                            {posts[0].excerpt}
                        </p>
                        <span style={{
                            color: 'var(--foreground)',
                            fontSize: '0.9rem',
                            borderBottom: '1px solid var(--foreground)',
                            paddingBottom: '0.2rem'
                        }}>
                            Read More →
                        </span>
                    </article>
                )}

                {/* Post List */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '2rem',
                    marginBottom: '6rem'
                }}>
                    {posts.slice(1).map((post) => (
                        <article key={post.slug}>
                            <div style={{
                                position: 'relative',
                                aspectRatio: '4/3',
                                marginBottom: '1rem',
                                overflow: 'hidden'
                            }}>
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <span style={{
                                fontSize: '0.7rem',
                                color: 'var(--primary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}>
                                {post.category} · {post.date}
                            </span>
                            <h3 style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: '1.3rem',
                                margin: '0.5rem 0'
                            }}>
                                {post.title}
                            </h3>
                            <p className="body-text" style={{
                                color: 'var(--secondary)',
                                fontSize: '0.9rem',
                                lineHeight: 1.6
                            }}>
                                {post.excerpt}
                            </p>
                        </article>
                    ))}
                </div>

                {/* Newsletter CTA */}
                <section style={{
                    textAlign: 'center',
                    padding: '4rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    marginBottom: '4rem'
                }}>
                    <h2 className="section-title" style={{ marginBottom: '1rem' }}>Stay Updated</h2>
                    <p className="body-text" style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>
                        Subscribe to the newsletter for the latest posts and updates
                    </p>
                    <Link
                        href="/#newsletter"
                        style={{
                            display: 'inline-block',
                            padding: '0.8rem 1.5rem',
                            border: '1px solid var(--foreground)',
                            color: 'var(--foreground)',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Subscribe
                    </Link>
                </section>

            </div>
        </main>
    );
}
