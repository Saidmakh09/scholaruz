import { LinkButton } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-28 text-center">
      <p className="text-5xl font-bold text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <LinkButton href="/">Go home</LinkButton>
        <LinkButton href="/students" variant="outline">
          Browse students
        </LinkButton>
      </div>
    </div>
  );
}
