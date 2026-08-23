import type { Metadata } from 'next';
import { DbPage, dbPageMetadata } from '@/components/shared/db-page';

export const revalidate = 86400;

export function generateMetadata(): Promise<Metadata> {
  return dbPageMetadata("termos-de-uso");
}

export default function Page() {
  return <DbPage slug={"termos-de-uso"} kicker={"Termos"} />;
}
