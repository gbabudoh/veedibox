import { getHomepageContent } from '@/lib/homepage';
import { HomepageContentClient } from '@/components/admin/HomepageContentClient';

export default async function AdminHomepageContentPage() {
  const content = await getHomepageContent();
  return <HomepageContentClient initialContent={content} />;
}
