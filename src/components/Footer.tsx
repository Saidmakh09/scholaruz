import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-4">
        <div className="sm:col-span-1">
          <Logo sizeClass="text-xl" />
          <p className="mt-3 max-w-xs text-sm text-muted">
            A nonprofit scholarship platform helping university students from Uzbekistan
            and across Central Asia, at home and abroad, reach their goals. Transparent
            funding, tracked from pledge to disbursement.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/scholarship" className="hover:text-ink">The scholarship</Link></li>
            <li><Link href="/students" className="hover:text-ink">Browse students</Link></li>
            <li><Link href="/resources" className="hover:text-ink">Resources</Link></li>
            <li><Link href="/about" className="hover:text-ink">About us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Get involved</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/register" className="hover:text-ink">Become a donor</Link></li>
            <li><Link href="/register" className="hover:text-ink">Apply as a student</Link></li>
            <li><Link href="/students" className="hover:text-ink">Fund a student today</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Why trust us</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Every contribution tracked end to end</li>
            <li>Funds reconciled to disbursements</li>
            <li>Secure payments via Stripe</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-5 text-center text-xs text-muted">
        <p>© {year} ScholarUz · Built to fund education in Uzbekistan and beyond.</p>
        <p className="mt-1 text-slate-400">
          Photography of Uzbekistan courtesy of Wikimedia Commons.
        </p>
      </div>
    </footer>
  );
}
