import AuthForm from '@/components/auth/AuthForm';

type SearchParams = Record<string, string | string[] | undefined>;
type Props = { searchParams?: Promise<SearchParams> };

export default async function Home({ searchParams }: Props) {
  const sp = searchParams ? await searchParams : undefined;
  const mode = (sp?.mode as 'login' | 'signup' | undefined) ?? 'login';
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Knot</h1>
      {/* ヒーローセクション＆一覧予定。ログインは /login に移動 */}
    </div>
  );
}