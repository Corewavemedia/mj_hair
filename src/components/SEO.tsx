import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: 'website' | 'product' | 'article';
    // Product specific props
    price?: number;
    currency?: string;
}

export default function SEO({
    title,
    description,
    image,
    url,
    type = 'website',
    price,
    currency = 'GBP'
}: SEOProps) {
    const siteName = "MJ Hair";
    // TODO: Replace with actual default image URL
    const defaultImage = "https://mj-hair.com/default-og.jpg";
    const metaImage = image || defaultImage;
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title} | {siteName}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={metaImage} />

            {/* Product Specific Tags */}
            {type === 'product' && price !== undefined && (
                <meta property="product:price:amount" content={price.toString()} />
            )}
            {type === 'product' && price !== undefined && (
                <meta property="product:price:currency" content={currency} />
            )}
        </Helmet>
    );
}
