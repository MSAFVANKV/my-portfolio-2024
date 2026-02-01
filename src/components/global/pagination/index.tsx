import { useSearchParams } from "react-router-dom";

type Props = {
  totalItems: number;
  itemsPerPage: number;
};

const SAFVAN_LENGTH = 6; // S a f v a n

const Pagination_V02 = ({ totalItems, itemsPerPage }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const query = searchParams.get("search");

  const handlePageChange = (page: number) => {
    const params: any = {};
    if (query) params.search = query;
    params.page = page;
    setSearchParams(params);
  };

  if (totalPages <= 1) return null;

  // 🔥 Build Safvan letters dynamically
  const buildLetters = () => {
    const base = ["S", "a", "f", "v"];

    const middleCount = totalPages - 5; // minus Safv + n
    const middle = Array(middleCount).fill("a");

    return [...base, ...middle, "n"];
  };

  const showLetters = totalPages > SAFVAN_LENGTH;

  return (
    <div className="flex flex-col items-center mt-16 gap-6">
      {/* 🔥 Letters only if pages > Safvan */}
      {showLetters && (
        <div className="flex gap- text-2xl font-semibold tracking-widest px-4 py-2 rounded-full">
          {buildLetters().map((letter, index) => {
            const pageNumber = index + 1;

            return (
              <button
                key={index}
                onClick={() => handlePageChange(pageNumber)}
                className={`transition hover:scale-110 ${
                  currentPage === pageNumber
                    ? "text-blue-500"
                    : "dark:text-white"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      )}

      {/* 🔥 Always show numbers */}
      <div className="flex gap-4 text-blue-500">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`hover:underline ${
              currentPage === page ? "font-bold text-black" : ""
            }`}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="hover:underline"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination_V02;
