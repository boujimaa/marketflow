export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b1120] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold text-blue-500">MarketFlow</h1>

        <button className="rounded-lg bg-blue-600 px-5 py-2 font-medium hover:bg-blue-700">
          Login
        </button>
      </nav>

      <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-8 py-32 text-center">
        <h2 className="text-6xl font-bold leading-tight">
          Schedule & Publish
          <br />
          Your Social Media
        </h2>

        <p className="mt-8 max-w-2xl text-lg text-slate-400">
          Publish automatically to Facebook and Instagram from one dashboard.
          More platforms are coming soon.
        </p>

        <button className="mt-10 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold hover:bg-blue-700">
          Get Started
        </button>
      </section>
    </main>
  );
}