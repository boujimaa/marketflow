import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { cn } from "@/components/ui/utils";
import type {
  MetaConnectedAccount,
  MetaConnectionStatus,
  MetaPlatform,
} from "@/types/meta";

export type ConnectedAccountCardProps = {
  account: MetaConnectedAccount;
  className?: string;
};

const statusVariant: Record<
  MetaConnectionStatus,
  "success" | "warning" | "default"
> = {
  connected: "success",
  disconnected: "default",
  pending: "warning",
};

const platformLabel: Record<MetaPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
};

const platformMark: Record<MetaPlatform, string> = {
  facebook: "f",
  instagram: "ig",
};

/**
 * Displays one connected Meta asset, such as a Facebook Page or Instagram Business Account.
 */
export default function ConnectedAccountCard({
  account,
  className,
}: ConnectedAccountCardProps) {
  return (
    <Card
      className={cn("flex items-start justify-between gap-4", className)}
      variant="interactive"
    >
      <div className="flex min-w-0 gap-4">
        <div
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold uppercase text-white"
        >
          {platformMark[account.platform]}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-white">
            {account.name}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {platformLabel[account.platform]} ·{" "}
            {account.accountType === "facebook_page"
              ? "Facebook Page"
              : "Instagram Business Account"}
          </p>
          {account.externalId ? (
            <p className="mt-1 text-xs text-slate-500">
              Meta ID: {account.externalId}
            </p>
          ) : null}
        </div>
      </div>

      <Badge className="shrink-0 capitalize" variant={statusVariant[account.status]}>
        {account.status}
      </Badge>
    </Card>
  );
}
