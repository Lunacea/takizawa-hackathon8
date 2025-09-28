import RequestList from '@/components/requests/RequestsList';
type SearchParams = Record<string, string | string[] | undefined>;
type Props = { searchParams?: Promise<SearchParams> };

export default async function Home({ searchParams }: Props) {
  const sp = searchParams ? await searchParams : undefined;
  const mode = (sp?.mode as 'login' | 'signup' | undefined) ?? 'login';
  return (
    <div className="container mx-auto py-8">
      <RequestList />
    </div>
  );
}