import AuthForm from '@/components/auth/AuthForm';

type SearchParams = Record<string, string | string[] | undefined>;
type Props = { searchParams?: Promise<SearchParams> };

export default async function Login({ searchParams }: Props) {
  const sp = searchParams ? await searchParams : undefined;
  const mode = (sp?.mode as 'login' | 'signup' | undefined) ?? 'login';
  const redirect = (sp?.redirect as string | undefined) ?? '/';
  return <AuthForm defaultMode={mode} redirect={redirect} />;
}