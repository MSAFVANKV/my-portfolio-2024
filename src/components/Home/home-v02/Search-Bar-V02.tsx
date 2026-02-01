import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import {
  HistoryItem,
  SearchItem,
  useSearchDataV02,
} from "@/utlis/searchData-v02";
import { useAuth } from "@/provider/context/AuthContext";

const SearchBarV02 = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login } = useAuth();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const SEARCH_DATA = useSearchDataV02();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [open, setOpen] = useState(false);

  /* ================= LOAD URL SEARCH INTO INPUT ================= */
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setQuery(urlSearch);
    } else {
      setQuery("");
    }
  }, [searchParams]);

  /* ================= LOAD HISTORY ================= */
  useEffect(() => {
    const stored = localStorage.getItem("search-history");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= FILTER RESULTS ================= */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const filtered = SEARCH_DATA.filter((item) =>
      item.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase())),
    );

    setResults(filtered);
  }, [query]);

  /* ================= SAVE HISTORY ================= */
  const saveHistory = (item: SearchItem) => {
    const updatedHistory = [
      { title: item.title },
      ...history.filter((h) => h.title !== item.title),
    ].slice(0, 6);

    localStorage.setItem("search-history", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  const removeHistoryItem = (title: string) => {
    const updated = history.filter((h) => h.title !== title);
    localStorage.setItem("search-history", JSON.stringify(updated));
    setHistory(updated);
  };

  const clearAllHistory = () => {
    localStorage.removeItem("search-history");
    setHistory([]);
  };

  /* ================= SUBMIT LOGIC ================= */
  const handleSubmit = (item?: SearchItem, fromHistory = false) => {
    if (!item) return;
    login();

    const original = SEARCH_DATA.find((d) => d.title === item.title);
    if (!original) return;

    if (!fromHistory) {
      saveHistory(original);
    }

    if (fromHistory && !original.callAgain) {
      setOpen(false);
      return;
    }

    original.action?.();

    if (original.redirect) {
      navigate(original.redirect);
    }

    setOpen(false);
  };

  /* ================= HANDLE INPUT CHANGE ================= */
  const handleInputChange = (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      // 🔥 remove search from URL
      const params: any = {};
      setSearchParams(params);
    } else {
      setSearchParams({ search: value });
    }
  };

  const shouldShowDropdown =
    open &&
    ((query.trim() && results.length > 0) ||
      (!query.trim() && history.length > 0));

  return (
    <div ref={wrapperRef} className="relative sm:w-3/4">
      {/* Search Bar */}
      <div className="h-12 rounded-full shadow-[0px_0px_9px_0px_#00000024] flex items-center px-4 bg-white">
        <CiSearch className="text-xl text-gray-500" />

        <input
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search here"
          className="w-full bg-transparent outline-none ml-3"
        />

        {query && (
          <IoClose
            onClick={() => handleInputChange("")}
            className="text-gray-400 hover:text-black cursor-pointer"
          />
        )}
      </div>

      {/* Dropdown */}
      {shouldShowDropdown && (
        <div className="absolute mt-2 w-full bg-white rounded-2xl shadow-xl p-3 z-50">
          {query.trim() ? (
            results.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSubmit(item)}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                {item.title}
              </div>
            ))
          ) : (
            <>
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-sm text-gray-500">Recent searches</span>
                <button
                  onClick={clearAllHistory}
                  className="text-xs text-red-500 hover:underline"
                >
                  Clear all
                </button>
              </div>

              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span
                    onClick={() =>
                      handleSubmit(
                        SEARCH_DATA.find((d) => d.title === item.title),
                        true,
                      )
                    }
                    className="cursor-pointer text-gray-600"
                  >
                    {item.title}
                  </span>

                  <IoClose
                    onClick={(e) => {
                      e.stopPropagation();
                      removeHistoryItem(item.title);
                    }}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                  />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBarV02;

// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { CiSearch } from "react-icons/ci";
// import { IoClose } from "react-icons/io5";
// import {
//   HistoryItem,
//   SearchItem,
//   useSearchDataV02,
// } from "@/utlis/searchData-v02";

// const SearchBarV02 = () => {
//   const navigate = useNavigate();
//   const wrapperRef = useRef<HTMLDivElement>(null);

//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<SearchItem[]>([]);
//   const [history, setHistory] = useState<HistoryItem[]>([]);
//   const [open, setOpen] = useState(false);
//   const SEARCH_DATA = useSearchDataV02();
//   // Load history
//   useEffect(() => {
//     const stored = localStorage.getItem("search-history");
//     if (stored) setHistory(JSON.parse(stored));
//   }, []);

//   // Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         wrapperRef.current &&
//         !wrapperRef.current.contains(e.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Filter results
//   useEffect(() => {
//     if (!query.trim()) {
//       setResults([]);
//       return;
//     }

//     const filtered = SEARCH_DATA.filter((item) =>
//       item.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase())),
//     );

//     setResults(filtered);
//   }, [query]);

//   // Save history
//   const saveHistory = (item: SearchItem) => {
//     const updatedHistory = [
//       { title: item.title },
//       ...history.filter((h) => h.title !== item.title),
//     ].slice(0, 6);

//     localStorage.setItem("search-history", JSON.stringify(updatedHistory));

//     setHistory(updatedHistory);
//   };

//   const removeHistoryItem = (title: string) => {
//     const updated = history.filter((h) => h.title !== title);
//     localStorage.setItem("search-history", JSON.stringify(updated));
//     setHistory(updated);
//   };

//   const clearAllHistory = () => {
//     localStorage.removeItem("search-history");
//     setHistory([]);
//   };

//   // 🔥 FINAL CONTROLLED SUBMIT LOGIC
//   const handleSubmit = (item?: SearchItem, fromHistory: boolean = false) => {
//     if (!item) return;

//     const original = SEARCH_DATA.find((d) => d.title === item.title);

//     if (!original) return;

//     // Save history only on normal click
//     if (!fromHistory) {
//       saveHistory(original);
//     }

//     // 🔥 If from history and callAgain is false → STOP
//     if (fromHistory && !original.callAgain) {
//       setOpen(false);
//       return;
//     }

//     // Otherwise execute normally
//     original.action?.();
//     if (original.redirect) {
//       navigate(original.redirect);
//     }

//     setOpen(false);
//   };

//   const shouldShowDropdown =
//     open &&
//     ((query.trim() && results.length > 0) ||
//       (!query.trim() && history.length > 0));

//   return (
//     <div ref={wrapperRef} className="relative w-3/4">
//       {/* Search Bar */}
//       <div className="h-12 rounded-full shadow-[0px_0px_9px_0px_#00000024] flex items-center px-4 bg-white">
//         <CiSearch className="text-xl text-gray-500" />
//         <input
//           type="search"
//           value={query}
//           onFocus={() => setOpen(true)}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search here"
//           className="w-full bg-transparent outline-none ml-3"
//         />
//       </div>

//       {/* Dropdown */}
//       {shouldShowDropdown && (
//         <div className="absolute mt-2 w-full bg-white rounded-2xl shadow-xl p-3 z-50">
//           {query.trim() ? (
//             results.map((item, index) => (
//               <div
//                 key={index}
//                 onClick={() => handleSubmit(item)}
//                 className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
//               >
//                 {item.title}
//               </div>
//             ))
//           ) : (
//             <>
//               <div className="flex justify-between items-center mb-2 px-2">
//                 <span className="text-sm text-gray-500">Recent searches</span>
//                 <button
//                   onClick={clearAllHistory}
//                   className="text-xs text-red-500 hover:underline"
//                 >
//                   Clear all
//                 </button>
//               </div>

//               {history.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-lg"
//                 >
//                   <span
//                     onClick={() =>
//                       handleSubmit(
//                         SEARCH_DATA.find((d) => d.title === item.title),
//                         true,
//                       )
//                     }
//                     className="cursor-pointer text-gray-600"
//                   >
//                     {item.title}
//                   </span>

//                   <IoClose
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removeHistoryItem(item.title);
//                     }}
//                     className="text-gray-400 hover:text-red-500 cursor-pointer"
//                   />
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBarV02;
