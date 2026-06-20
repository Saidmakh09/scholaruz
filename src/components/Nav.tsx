import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { Logo } from "./Logo";
import { LinkButton } from "./ui";

const navLinks = [
  { href: "/scholarship", label: "Scholarship" },
  { href: "/students", label: "Students" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

export async function Nav() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" aria-label="ScholarUz home">
          <Logo sizeClass="text-xl sm:text-2xl" />
        </Link>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-ink md:block"
            >
              {l.label}
            </Link>
          ))}

          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-accent-700 hover:bg-accent-50"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-ink"
              >
                Dashboard
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-ink"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-ink"
              >
                Sign in
              </Link>
              <LinkButton href="/register" variant="primary" size="sm">
                Get started
              </LinkButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
