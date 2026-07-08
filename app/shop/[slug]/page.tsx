import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, PRODUCTS } from "../../lib/productCatalog";
import ProductDetailClient from "./ProductDetailClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4017";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "ไม่พบสินค้า | Porpaw", robots: { index: false, follow: false } };

  const title = `${product.name} ${product.weight} | Porpaw`;
  return {
    title,
    description: product.description,
    keywords: [product.name, product.category, "อาหารสัตว์เลี้ยง", "Porpaw"],
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: { title, description: product.description, url: `/shop/${product.slug}`, type: "website", images: [{ url: product.image, alt: product.name }] },
    twitter: { card: "summary_large_image", title, description: product.description, images: [product.image] },
  };
}

export default async function ProductDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ packageId?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const requestedPackageId = Number(query.packageId);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [`${siteUrl}${product.image}`],
    description: product.description,
    sku: `PORPAW-${product.id}`,
    brand: { "@type": "Brand", name: "Porpaw" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: 24 },
    offers: { "@type": "Offer", url: `${siteUrl}/shop/${product.slug}`, priceCurrency: "THB", price: product.price, availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition" },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <ProductDetailClient product={product} packageId={Number.isFinite(requestedPackageId) ? requestedPackageId : undefined} />
  </>;
}
