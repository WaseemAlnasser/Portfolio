"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { label: string; href: string; external?: boolean };

export function Header({ name, items }: { name: string; items: Item[] }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/95 backdrop-blur">
      {/* Without JavaScript the menu button cannot work, so show the links. */}
      <noscript>
        <style>{`#site-nav{display:flex!important}#menu-button{display:none!important}`}</style>
      </noscript>
      <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-x-6">
        <Link href="/" className="py-3 text-base font-semibold tracking-tight" onClick={() => setOpen(false)}>
          {name}
        </Link>

        <button
          id="menu-button"
          ref={buttonRef}
          type="button"
          className="btn btn-secondary md:hidden"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
          <span className="sr-only"> navigation</span>
        </button>

        <nav
          id="site-nav"
          aria-label="Primary"
          className={`${open ? "flex" : "hidden"} w-full flex-col pb-3 md:flex md:w-auto md:flex-row md:items-center md:gap-1 md:pb-0`}
        >
          {items.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                className="rounded px-3 py-3 text-[0.95rem] font-medium text-muted hover:text-accent md:py-2"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="rounded px-3 py-3 text-[0.95rem] font-medium text-muted hover:text-accent md:py-2"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
