import { LoginForm } from "@/components/auth";

type LoginPageProps = {
  searchParams?: Promise<{
    message?: string;
    redirectTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1120] px-6 py-12 text-white">
      <LoginForm message={params?.message} redirectTo={params?.redirectTo} />
    </main>
  );
}
