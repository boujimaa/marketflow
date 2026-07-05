import { redirectAuthenticatedUser } from "@/lib/auth/guards";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await redirectAuthenticatedUser();

  return <>{children}</>;
}
