import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <Logo sizeClass="text-xl" />
          <p className="mt-3 max-w-xs text-sm text-muted">
            A nonprofit platform connecting donors with students who lack access to
            educational funding — with transparent, reconciled funding from pledge to
            disbursement.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/students" className="hover:text-ink">Browse students</Link></li>
            <li><Link href="/about" className="hover:text-ink">How it works</Link></li>
            <li><Link href="/register" className="hover:text-ink">Become a donor</Link></li>
            <li><Link href="/register" className="hover:text-ink">Apply as a student</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Trust &amp; transparency</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Every contribution tracked end-to-end</li>
            <li>Funds reconciled to disbursements</li>
            <li>Secure payments via Stripe</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} ScholarUz · Built to fund education in Uzbekistan and beyond.
      </div>
    </footer>
  );
}
