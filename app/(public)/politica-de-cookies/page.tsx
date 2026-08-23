import type { Metadata } from 'next';
import { DbPage, dbPageMetadata } from '@/components/shared/db-page';

export const revalidate = 86400;

export function generateMetadata(): Promise<Metadata> {
  return dbPageMetadata("politica-de-cookies");
}

export default function Page() {
  return <DbPage slug={"politica-de-cookies"} kicker={"Cookies"} />;
}
