import Button, { type ButtonProps } from "@/components/ui/Button";

export type ConnectFacebookButtonProps = Omit<
  ButtonProps,
  "children" | "onClick" | "type"
>;

/**
 * Starts the server-side Meta OAuth flow for Facebook connection.
 */
export default function ConnectFacebookButton({
  ...props
}: ConnectFacebookButtonProps) {
  return (
    <form action="/api/meta/facebook/connect" method="get">
      <Button
        aria-label="Connect Facebook through Meta OAuth"
        type="submit"
        {...props}
      >
        <span
          aria-hidden="true"
          className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600"
        >
          f
        </span>
        Connect Facebook
      </Button>
    </form>
  );
}
