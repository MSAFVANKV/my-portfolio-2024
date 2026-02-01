import Pagination_V02 from "@/components/global/pagination";
import { SearchResultItem } from "@/utlis/searchData-v02";
import { Link, useSearchParams } from "react-router-dom";

type Props = {
  SEARCH_RESULTS: Record<string, SearchResultItem[]>;
};

const ITEMS_PER_PAGE = 6;

const AuthorizeSecLeft_V02 = ({ SEARCH_RESULTS }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  //   const navigate = useNavigate();

  const query = searchParams.get("search")?.toLowerCase();
  const pageParam = searchParams.get("page");
  const isViewAll = pageParam === "all";

  const page = !isViewAll ? Number(pageParam) || 1 : 1;

  const allResults = Object.values(SEARCH_RESULTS).flat();
  const results = query ? SEARCH_RESULTS[query] || [] : allResults;

  const startIndex = (page - 1) * ITEMS_PER_PAGE;

  const paginatedResults = isViewAll
    ? results
    : results.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleViewAll = () => {
    const params: any = {};
    if (query) params.search = query;
    params.page = "all";
    setSearchParams(params);
  };

  const handleShowLess = () => {
    const params: any = {};
    if (query) params.search = query;
    params.page = 1; // back to normal pagination
    setSearchParams(params);
  };

  //   const isExternal = (url: string) =>
  //     url.startsWith("http") && !url.includes("localhost:3001");

  //   const handleLinkClick = (url: string) => {
  //     if (isExternal(url)) {
  //       navigate(`/preview?url=${encodeURIComponent(url)}`);
  //     } else {
  //       navigate(url.replace("http://localhost:3001", ""));
  //     }
  //   };

  return (
    <div className="sm:px-10 py-6 max-w-3xl">
      <p className="text-sm text-gray-500 mb-6">
        About {results.length} results
        {query && ` for "${query}"`}
      </p>

      <div className="flex flex-col gap-8">
        {paginatedResults.map((item, index) => (
          <div key={index} className="flex flex-col gap-1 border-b pb-3">
            <span className="text-sm text-gray-500 truncate">{item.url}</span>

            <Link
              to={item.url}
              target="_blank"
              className="text-xl text-blue-600 hover:underline"
            >
              {item.title}
            </Link>
            {/* <button
              onClick={() => handleLinkClick(item.url)}
              className="text-left text-xl text-blue-600 hover:underline"
            >
              {item.title}
            </button> */}

            <p className="text-sm text-gray-700 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}

        {results.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>

      {/* View All Button */}
      {!isViewAll && results.length > ITEMS_PER_PAGE && (
        <div
          className="flex justify-center mt-10 w-full h-[1px] bg-black/30
         relative"
        >
          <button
            onClick={handleViewAll}
            className="px-6 py-2 absolute md:min-w-[300px] sm:min-w-[200px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 border border-black/30
             rounded-full bg-neutral-100 dark:text-white hover:text-white hover:bg-neutral-500 transition"
          >
            View all →
          </button>
        </div>
      )}

      {/* Show Less Button */}
      {isViewAll && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleShowLess}
            className="px-6 py-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition"
          >
            Show less ↑
          </button>
        </div>
      )}

      {/* Pagination (hide when view all) */}
      {!isViewAll && (
        <Pagination_V02
          totalItems={results.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
};

export default AuthorizeSecLeft_V02;
