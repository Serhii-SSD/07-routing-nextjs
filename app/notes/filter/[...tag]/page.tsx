import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesFilterClient from './NotesFilter.client';

interface FilterPageProps {
  params: Promise<{ tag: string[] }>;
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { tag } = await params;
  const tagSlug = tag[0];
  const queryClient = new QueryClient();

  const fetchParams: { page: number; perPage: number; tag?: string } = {
    page: 1,
    perPage: 12,
  };

  if (tagSlug !== 'all') {
    fetchParams.tag = tagSlug;
  }

  await queryClient.prefetchQuery({
    queryKey: ['notes', 0, '', tagSlug],
    queryFn: () => fetchNotes(fetchParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesFilterClient initialTag={tagSlug} />
    </HydrationBoundary>
  );
}