"use client";

import Link from "next/link";
import { CART_EVENT, cartCount } from "@/lib/cart";
import { useEffect, useState } from "react";

export default function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(cartCount());
    update();
    window.addEventListener(CART_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CART_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <Link
      href="/cart"
      className="relative rounded-full bg-ember px-5 py-2 text-sm font-semibold text-cream hover:bg-ember-dark transition-colors"
    >
      Cart
      {count > 0 && (
        <span
          key={count}
          className="badge-pop absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-moss px-1 text-xs font-bold text-cream"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
