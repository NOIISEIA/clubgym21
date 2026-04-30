"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { WPMenu } from "@/lib/types";

type Props = {
  menu: WPMenu;
};

export function Navigation({ menu }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  const rootItems = menu.menuItems.nodes.filter((item) => !item.parentId);

  // Fermer le menu mobile sur clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        mobileRef.current &&
        !mobileRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav ref={mobileRef}>
      {/* Desktop */}
      <ul className="hidden lg:flex items-center gap-1">
        {rootItems.map((item) => {
          const hasChildren = (item.childItems?.nodes?.length ?? 0) > 0;
          return (
            <li key={item.id} className="relative group">
              <Link
                href={item.url}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors inline-block"
              >
                {item.label}
                {hasChildren && (
                  <span className="ml-1 text-xs opacity-60">▾</span>
                )}
              </Link>
              {hasChildren && (
                <ul className="absolute top-full left-0 min-w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                  {item.childItems!.nodes.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={child.url}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {/* Bouton burger mobile */}
      <button
        className="lg:hidden p-2 text-gray-700 hover:text-primary transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-white border-t border-gray-100 shadow-lg z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <ul className="py-4 px-4">
            {rootItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  className="block py-3 px-2 text-gray-800 font-medium hover:text-primary border-b border-gray-50 last:border-0 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {(item.childItems?.nodes?.length ?? 0) > 0 && (
                  <ul className="pl-4 pb-2">
                    {item.childItems!.nodes.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={child.url}
                          className="block py-2 px-2 text-sm text-gray-600 hover:text-primary transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
