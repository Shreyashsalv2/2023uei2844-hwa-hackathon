import Link from "next/link";

const shopLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/products/refill", label: "Refill feeder" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const supportLinks = [
  { href: "/shipping-and-returns", label: "Shipping & returns" },
  { href: "/privacy", label: "Privacy" },
  { href: "/api-docs", label: "API docs" },
];

export default function Footer() {
  return (
    <footer className="bg-bark text-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold">
            Refill<span className="text-ember">.</span>
          </p>
          <p className="mt-3 text-sm text-cream/70 leading-relaxed">
            The self-resetting puzzle feeder for dogs. Engagement that never
            runs out — and never overfeeds.
          </p>
        </div>
        <FooterColumn title="Shop" links={shopLinks} />
        <FooterColumn title="Company" links={companyLinks} />
        <FooterColumn title="Support" links={supportLinks} />
      </div>
      <div className="border-t border-cream/15">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/60">
          <p>© {new Date().getFullYear()} Refill. All rights reserved.</p>
          <p>Pay on delivery · Free delivery on orders ₹4,999+</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-cream/90">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-cream/70 hover:text-ember transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
