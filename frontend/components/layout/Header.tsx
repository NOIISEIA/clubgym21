import Image from "next/image";
import Link from "next/link";
import { getMenus, getGlobalOptions } from "@/lib/wordpress";
import { Navigation } from "./Navigation";

export async function Header() {
  const [menus, options] = await Promise.all([
    getMenus(),
    getGlobalOptions(),
  ]);

  const headerMenu = menus.find(
    (m) =>
      m.slug === "header" ||
      m.slug === "menu-header" ||
      m.slug === "header-menu" ||
      m.name.toLowerCase().includes("header") ||
      m.name.toLowerCase().includes("principal")
  );

  const logo = options?.acfOptions?.logo?.node;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex-shrink-0" aria-label="Accueil">
            {logo ? (
              <Image
                src={logo.sourceUrl}
                alt={logo.altText || "Logo"}
                width={logo.width ?? 180}
                height={logo.height ?? 50}
                className="h-10 lg:h-12 w-auto"
                priority
              />
            ) : (
              <span className="text-xl font-bold text-primary">Logo</span>
            )}
          </Link>

          {headerMenu && <Navigation menu={headerMenu} />}
        </div>
      </div>
    </header>
  );
}
