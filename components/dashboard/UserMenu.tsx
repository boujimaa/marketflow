import { logout } from "@/lib/auth/auth";
import Button from "@/components/ui/Button";

export type UserMenuProps = {
  email?: string;
};

export default function UserMenu({ email }: UserMenuProps) {
  const initials = email?.slice(0, 2).toUpperCase() || "MF";

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-white">{email || "Account"}</p>
        <p className="text-xs text-slate-500">Signed in</p>
      </div>

      <div
        aria-label="User avatar"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200"
        role="img"
      >
        {initials}
      </div>

      <form action={logout}>
        <Button size="sm" type="submit" variant="secondary">
          Log out
        </Button>
      </form>
    </div>
  );
}
