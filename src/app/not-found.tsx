import Link from "next/link";

export const metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <section className="container-page py-24">
      <p className="label">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">This page doesn’t exist.</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        The link may be out of date. The homepage has the selected work, experience and contact details.
      </p>
      <p className="mt-8">
        <Link href="/" className="btn btn-primary">
          Back to the homepage
        </Link>
      </p>
    </section>
  );
}
