export type AuthFormMessageProps = {
  error?: string;
  message?: string;
};

export default function AuthFormMessage({ error, message }: AuthFormMessageProps) {
  if (!error && !message) {
    return null;
  }

  return (
    <p
      aria-live="polite"
      className={
        error
          ? "rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          : "rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
      }
      role={error ? "alert" : "status"}
    >
      {error || message}
    </p>
  );
}
