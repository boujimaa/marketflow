import {
  AccountsEmptyState,
  ConnectFacebookButton,
  ConnectedAccountCard,
  MetaAccountPlaceholders,
  MetaOAuthPlaceholder,
} from "@/components/social";
import Card from "@/components/ui/Card";
import type { MetaConnectedAccount } from "@/types/meta";

const connectedAccounts: MetaConnectedAccount[] = [];

type AccountsPageProps = {
  searchParams?: Promise<{
    facebook?: string;
  }>;
};

export default async function AccountsPage({ searchParams }: AccountsPageProps) {
  const params = await searchParams;
  const facebookStatus = params?.facebook;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-400">Meta accounts</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-white">
            Facebook and Instagram connections
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Frontend foundation for connecting Facebook Pages and Instagram
            Business Accounts through Meta OAuth.
          </p>
        </div>

        <ConnectFacebookButton />
      </header>

      {facebookStatus === "connected" ? (
        <Card className="border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
          Facebook was connected successfully.
        </Card>
      ) : null}

      {facebookStatus === "error" ? (
        <Card className="border-red-500/30 bg-red-500/10 text-red-200">
          Facebook connection failed. Please try again.
        </Card>
      ) : null}

      {connectedAccounts.length > 0 ? (
        <section aria-labelledby="connected-accounts-heading">
          <h2
            id="connected-accounts-heading"
            className="mb-4 text-lg font-semibold text-white"
          >
            Connected accounts
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {connectedAccounts.map((account) => (
              <ConnectedAccountCard account={account} key={account.id} />
            ))}
          </div>
        </section>
      ) : (
        <AccountsEmptyState />
      )}

      <MetaAccountPlaceholders />
      <MetaOAuthPlaceholder />
    </div>
  );
}
