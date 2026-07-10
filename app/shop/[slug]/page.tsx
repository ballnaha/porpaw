import type { Metadata } from "next";
import { PRODUCTS } from "../../lib/productCatalog";
import { getShopProductBySlugForPage } from "../../lib/shopProductsDb";
import ProductDetailClient from "./ProductDetailClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4017";
const metadataBase = new URL(siteUrl);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = await getShopProductBySlugForPage(decodedSlug);
  if (!product) {
    const nameFromSlug = decodedSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${nameFromSlug} | baebite`,
      description: `รายละเอียดสินค้า ${nameFromSlug} - baebite`,
      metadataBase,
      robots: { index: false, follow: true },
    };
  }

  const title = `${product.name} | baebite`;
  const imageUrl = product.image.startsWith("http") ? product.image : `${siteUrl}${product.image}`;

  return {
    metadataBase,
    title,
    description: product.description,
    keywords: [product.name, product.category, "อาหารสัตว์เลี้ยง", "baebite"],
    alternates: { canonical: `/shop/${product.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description: product.description,
      url: `/shop/${product.slug}`,
      type: "website",
      siteName: "baebite",
      locale: "th_TH",
      images: [{ url: imageUrl, alt: product.name }],
    },
    twitter: { card: "summary_large_image", title, description: product.description, images: [imageUrl] },
  };
}

export default async function ProductDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ packageId?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const decodedSlug = decodeURIComponent(slug);
  const requestedPackageId = Number(query.packageId);
  const product = await getShopProductBySlugForPage(decodedSlug);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.name,
    image: product ? [`${siteUrl}${product.image}`] : [],
    description: product?.description,
    sku: product ? `baebite-${product.id}` : undefined,
    brand: { "@type": "Brand", name: "baebite" },
    aggregateRating: product ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: 24 } : undefined,
    offers: product ? { "@type": "Offer", url: `${siteUrl}/shop/${product.slug}`, priceCurrency: "THB", price: product.price, availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition" } : undefined,
  };

  return <>
    {product && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />}
    <ProductDetailClient product={product ?? null} slug={decodedSlug} packageId={Number.isFinite(requestedPackageId) ? requestedPackageId : undefined} />
  </>;
}
