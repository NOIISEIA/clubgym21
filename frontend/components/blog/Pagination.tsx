import Link from "next/link";

type Props = {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  basePath: string;
};

export function Pagination({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  basePath,
}: Props) {
  if (!hasNextPage && !hasPreviousPage) return null;

  const prevHref =
    currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`;
  const nextHref = `${basePath}?page=${currentPage + 1}`;

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center items-center gap-4 mt-16"
    >
      {hasPreviousPage ? (
        <Link
          href={prevHref}
          className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors"
        >
          ← Précédent
        </Link>
      ) : (
        <span className="px-6 py-3 rounded-lg bg-gray-50 text-gray-300 font-medium cursor-not-allowed">
          ← Précédent
        </span>
      )}

      <span className="px-4 py-2 text-sm text-gray-500">
        Page {currentPage}
      </span>

      {hasNextPage ? (
        <Link
          href={nextHref}
          className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors"
        >
          Suivant →
        </Link>
      ) : (
        <span className="px-6 py-3 rounded-lg bg-gray-50 text-gray-300 font-medium cursor-not-allowed">
          Suivant →
        </span>
      )}
    </nav>
  );
}
