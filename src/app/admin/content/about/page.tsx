import { getAboutContent } from '@/lib/about';
import { AboutContentClient } from '@/components/admin/AboutContentClient';

export default async function AdminAboutContentPage() {
  const content = await getAboutContent();
  return <AboutContentClient initialContent={content} />;
}
