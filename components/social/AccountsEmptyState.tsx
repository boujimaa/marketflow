import EmptyState from "@/components/ui/EmptyState";
import ConnectFacebookButton from "./ConnectFacebookButton";

export default function AccountsEmptyState() {
  return (
    <EmptyState
      title="No Meta accounts connected"
      description="Connect Facebook first. Instagram Business Accounts will be discovered from eligible Facebook Pages later through the Meta Graph API."
      icon={
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-lg font-bold text-blue-300">
          M
        </div>
      }
    >
      <ConnectFacebookButton className="mt-6" />
    </EmptyState>
  );
}
