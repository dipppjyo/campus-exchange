import ListingDetailClient from "./ListingDetailClient";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export default function ListingPage() {
  return <ListingDetailClient />;
}
