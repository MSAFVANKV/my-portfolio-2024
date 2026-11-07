// components/daily-work-tracker/WorkEntriesTable.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";
import { MdCancel } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";

import {
  ITaskTrackerField,
  ITaskTrackerSchema,
  IWorkEntryType,
} from "@/types/taskTracker";

import {
  deleteMultipleWorkEntries,
  deleteWorkEntry,
} from "@/services/spread-sheet/taskTrackerApi";

import MyClock from "../global/clock";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/provider/redux/hook";
import { fetchWorkEntries } from "@/provider/redux/slices/googleSheetSlice";

type Props = {
  setEditData: (data: IWorkEntryType | null) => void;
  isEdit?: boolean;
  googleScriptUrl: string;
  googleSheetUrl: string;
  schema: ITaskTrackerSchema;
};

const WorkEntriesTable = ({
  setEditData,
  googleScriptUrl,
  googleSheetUrl,
  schema,
  isEdit,
}: Props) => {
  const dispatch = useAppDispatch();

  // Get data and loading directly from Redux
  const {
    entries,
    isLoading: loading,
    isError,
    error: reduxError,
  } = useAppSelector((state) => state.googleSheet);

  // Local table error for client-side actions (validation, sheet url issues, etc.)
  const [localError, setLocalError] = useState("");
  const error = localError || (isError && reduxError ? reduxError : "");

  /**
   * Single delete loading.
   */
  const [deletingRow, setDeletingRow] = useState<number | null>(null);

  /**
   * Multiple delete loading.
   */
  const [deletingMultiple, setDeletingMultiple] = useState(false);

  /**
   * Selected rows.
   */
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  /**
   * ============================
   * TABLE FIELDS
   * ============================
   */
  const tableFields = useMemo(() => {
    if (!schema || !Array.isArray(schema.fields)) {
      return [];
    }

    return schema.fields.filter((field) => field.table !== false);
  }, [schema]);

  /**
   * ============================
   * LOAD / REFETCH ENTRIES
   * Dispatches Redux Thunk
   * ============================
   */
  const loadEntries = useCallback(() => {
    if (!googleScriptUrl?.trim()) {
      setLocalError("Google Apps Script URL is not configured.");
      return;
    }

    if (!schema || !Array.isArray(schema.fields)) {
      setLocalError("Invalid tracker schema.");
      return;
    }

    setLocalError("");
    setSelectedRows(new Set());
    dispatch(fetchWorkEntries({ googleScriptUrl, schema }));
  }, [dispatch, googleScriptUrl, schema]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  /**
   * ============================
   * SELECTION
   * ============================
   */
  const entryRows = useMemo(
    () =>
      entries
        .map((entry) => entry.row)
        .filter((row) => Number.isInteger(row) && row > 0),
    [entries],
  );

  const allSelected =
    entryRows.length > 0 && entryRows.every((row) => selectedRows.has(row));

  const someSelected =
    entryRows.some((row) => selectedRows.has(row)) && !allSelected;

  const toggleRowSelection = (row: number) => {
    setSelectedRows((previous) => {
      const next = new Set(previous);

      if (next.has(row)) {
        next.delete(row);
      } else {
        next.add(row);
      }

      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedRows(() => {
      if (allSelected) {
        return new Set();
      }

      return new Set(entryRows);
    });
  };

  /**
   * ============================
   * SINGLE DELETE
   * ============================
   */
  const handleDelete = async (entry: IWorkEntryType) => {
    if (!entry || typeof entry !== "object") {
      setLocalError("Invalid work entry.");
      return;
    }

    if (
      typeof entry.row !== "number" ||
      !Number.isFinite(entry.row) ||
      entry.row <= 0
    ) {
      setLocalError("Could not identify this work entry.");
      return;
    }

    const row = entry.row;
    const values = entry.values || {};

    const possibleDisplayFields = [
      "task",
      "title",
      "name",
      "description",
      "project",
      "customer",
      "work",
    ];

    let displayValue = "this work entry";

    for (const key of possibleDisplayFields) {
      const value = values[key];

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        displayValue = String(value);
        break;
      }
    }

    if (displayValue === "this work entry") {
      const firstValue = Object.values(values).find(
        (value) =>
          value !== undefined && value !== null && String(value).trim() !== "",
      );

      if (firstValue !== undefined) {
        displayValue = String(firstValue);
      }
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${displayValue}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingRow(row);
      setLocalError("");

      if (!googleScriptUrl?.trim()) {
        throw new Error("Google Apps Script URL is not configured.");
      }

      await deleteWorkEntry(googleScriptUrl, row);

      // Refetch via Redux
      loadEntries();

      setEditData(null);
    } catch (err) {
      console.error("Failed to delete work entry:", err);
      setLocalError(
        err instanceof Error ? err.message : "Failed to delete work entry.",
      );
    } finally {
      setDeletingRow(null);
    }
  };

  /**
   * ============================
   * MULTIPLE DELETE
   * ============================
   */
  const handleDeleteSelected = async () => {
    const rows = Array.from(selectedRows).filter(
      (row) => Number.isInteger(row) && row > 0,
    );

    if (rows.length === 0) {
      setLocalError("Please select at least one work entry.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${rows.length} selected work ${
        rows.length === 1 ? "entry" : "entries"
      }?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingMultiple(true);
      setLocalError("");

      if (!googleScriptUrl?.trim()) {
        throw new Error("Google Apps Script URL is not configured.");
      }

      await deleteMultipleWorkEntries(googleScriptUrl, rows);

      setSelectedRows(new Set());

      // Reload Google Sheet data via Redux
      loadEntries();

      setEditData(null);
    } catch (err) {
      console.error("Failed to delete selected work entries:", err);
      setLocalError(
        err instanceof Error
          ? err.message
          : "Failed to delete selected work entries.",
      );
    } finally {
      setDeletingMultiple(false);
    }
  };

  /**
   * ============================
   * FORMAT VALUE
   * ============================
   */
  function formatValue(field: ITaskTrackerField, value: unknown) {
    if (value === undefined || value === null || String(value).trim() === "") {
      return "-";
    }

    if (field.type === "url") {
      const url = String(value).trim();

      try {
        const parsedUrl = new URL(url);

        return (
          <a
            href={parsedUrl.toString()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Open
          </a>
        );
      } catch {
        return (
          <span className="truncate" title={url}>
            {url}
          </span>
        );
      }
    }

    if (field.type === "number") {
      return String(value);
    }

    if (field.type === "datetime") {
      return formatSubmittedAt(String(value));
    }

    if (field.type === "date") {
      const dateValue = String(value).trim();

      if (!dateValue) {
        return "-";
      }

      return (
        <MyClock
          date={dateValue}
          showTime={false}
          className="text-[11px] text-slate-600"
        />
      );
    }

    if (field.key === "priority") {
      return <PriorityBadge priority={String(value)} />;
    }

    if (field.key === "status") {
      return <StatusBadge status={String(value)} />;
    }

    return String(value);
  }

  const handleEditDataChange = (data: IWorkEntryType | null) => {
    setEditData(data);

    if (data) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleOpenSheet = () => {
    if (!googleSheetUrl?.trim()) {
      setLocalError("Google Sheet URL is not configured.");
      return;
    }

    try {
      const url = new URL(googleSheetUrl);

      if (!url.hostname.includes("docs.google.com")) {
        throw new Error();
      }

      window.open(url.toString(), "_blank", "noopener,noreferrer");
    } catch {
      setLocalError("The configured Google Sheet URL is invalid.");
    }
  };

  return (
    <section className="mt-8 space-y-3 overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={loadEntries}
          disabled={loading || deletingMultiple}
          className="h-9 gap-1.5 px-3 text-sm"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>

        <Button
          type="button"
          aria-label="Open Google Sheet"
          className="h-9 gap-1.5 bg-green-700 px-3 text-sm hover:bg-green-800"
          onClick={handleOpenSheet}
          disabled={deletingMultiple}
        >
          <RiFileExcel2Fill size={15} />
          Sheet
        </Button>
      </div>

      {/* ERROR */}
      {!loading && error && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="text-sm text-slate-500">Loading work entries...</div>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && entries.length === 0 && (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="text-center">
            <p className="font-medium text-slate-700">No work entries found</p>
            <p className="mt-1 text-sm text-slate-500">
              Submit your first work entry to see it here.
            </p>
          </div>
        </div>
      )}

      {/* TABLE */}
      {!loading && !error && entries.length > 0 && tableFields.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="max-h-[calc(100vh-280px)] overflow-auto">
            <table className="min-w-[1100px] w-full table-auto text-left text-xs">
              <thead className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm">
                <tr className="border-b border-slate-200">
                  {/* SELECT ALL */}
                  <th className="sticky left-0 z-30 w-10 bg-slate-50/95 px-2 py-2">
                    <Checkbox
                      checked={
                        allSelected
                          ? true
                          : someSelected
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={toggleSelectAll}
                      disabled={deletingMultiple}
                      aria-label="Select all work entries"
                    />
                  </th>

                  {/* DYNAMIC FIELDS */}
                  {tableFields.map((field) => (
                    <th
                      key={field.key}
                      className="whitespace-nowrap px-3 py-2 font-semibold text-[11px] uppercase tracking-wide text-slate-500"
                    >
                      {field.label}
                    </th>
                  ))}

                  {/* ACTION */}
                  <th className="whitespace-nowrap px-3 py-2 font-semibold text-[11px] uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {entries.map((entry, index) => {
                  if (!entry || !entry.values) {
                    return null;
                  }

                  const isDeleting = deletingRow === entry.row;
                  const isSelected = selectedRows.has(entry.row);

                  return (
                    <tr
                      key={`${entry.row}-${index}`}
                      className={`border-b border-slate-100 last:border-0 transition-colors ${
                        isSelected ? "bg-blue-50/70" : "hover:bg-slate-50"
                      }`}
                    >
                      {/* ROW CHECKBOX */}
                      <td className="w-10 px-2 py-2 align-middle">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleRowSelection(entry.row)}
                          disabled={isDeleting || deletingMultiple}
                          aria-label={`Select row ${entry.row}`}
                        />
                      </td>

                      {/* DYNAMIC FIELDS */}
                      {tableFields.map((field) => (
                        <td
                          key={`${entry.row}-${field.key}`}
                          className="max-w-64 px-3 py-2 align-middle text-xs leading-4 text-slate-700"
                        >
                          {formatValue(field, entry.values?.[field.key])}
                        </td>
                      ))}

                      {/* ACTION */}
                      <td className="whitespace-nowrap px-3 py-2 align-middle">
                        <div className="flex items-center gap-2">
                          {/* EDIT */}
                          <button
                            type="button"
                            onClick={() => handleEditDataChange(entry)}
                            disabled={isDeleting || deletingMultiple}
                            className="inline-flex h-7 items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 text-[11px] font-medium text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
                          >
                            {isEdit ? (
                              <>
                                <MdCancel />
                                Cancel
                              </>
                            ) : (
                              <>
                                <Pencil size={14} />
                                Edit
                              </>
                            )}
                          </button>

                          {/* SINGLE DELETE */}
                          <button
                            type="button"
                            onClick={() => handleDelete(entry)}
                            disabled={isDeleting || deletingMultiple}
                            className="inline-flex h-7 items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 text-[11px] font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INVALID SCHEMA */}
      {!loading && !error && tableFields.length === 0 && (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-red-100 bg-red-50">
          <div className="text-center">
            <p className="font-medium text-red-700">
              No table fields available
            </p>
            <p className="mt-1 text-sm text-red-600">
              The configured Google Script returned an invalid or empty schema.
            </p>
          </div>
        </div>
      )}

      {/* FLOATING BULK DELETE ACTION */}
      {selectedRows.size > 0 && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-900 px-2 text-xs font-semibold text-white">
              {selectedRows.size}
            </span>
            <span className="text-xs font-medium text-slate-600">selected</span>
          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={deletingMultiple || deletingRow !== null}
            className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold shadow-sm"
          >
            <Trash2 size={14} />
            {deletingMultiple ? "Deleting..." : "Delete Selected"}
          </Button>
        </div>
      )}
    </section>
  );
};

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    Low: "bg-blue-50 text-blue-600",
    Medium: "bg-yellow-50 text-yellow-700",
    High: "bg-orange-50 text-orange-600",
    Urgent: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[priority] || "bg-slate-100 text-slate-600"
      }`}
    >
      {priority || "-"}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Not Started": "bg-slate-100 text-slate-600",
    "In Progress": "bg-blue-50 text-blue-600",
    Completed: "bg-emerald-50 text-emerald-600",
    Blocked: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "-"}
    </span>
  );
}

function formatSubmittedAt(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default WorkEntriesTable;
// import { useCallback, useEffect, useMemo, useState } from "react";

// import { Pencil, RefreshCw, Trash2 } from "lucide-react";

// import { MdCancel } from "react-icons/md";

// import {
//   ITaskTrackerField,
//   ITaskTrackerSchema,
//   IWorkEntryType,
// } from "@/types/taskTracker";

// import {
//   deleteMultipleWorkEntries,
//   deleteWorkEntry,
//   getWorkEntries,
// } from "@/services/spread-sheet/taskTrackerApi";

// import MyClock from "../global/clock";
// import { Button } from "../ui/button";
// import { Checkbox } from "../ui/checkbox";

// import { RiFileExcel2Fill } from "react-icons/ri";

// type Props = {
//   setEditData: (data: IWorkEntryType | null) => void;

//   isEdit?: boolean;

//   googleScriptUrl: string;

//   googleSheetUrl: string;

//   schema: ITaskTrackerSchema;
// };

// /**
//  * ============================
//  * NORMALIZE ENTRY
//  * ============================
//  */

// function normalizeEntry(
//   rawEntry: unknown,
//   schema: ITaskTrackerSchema,
// ): IWorkEntryType | null {
//   if (!rawEntry || typeof rawEntry !== "object") {
//     return null;
//   }

//   const raw = rawEntry as Record<string, unknown>;

//   const rowNumber = Number(raw.row);

//   if (!Number.isFinite(rowNumber) || rowNumber <= 0) {
//     return null;
//   }

//   let values: Record<string, unknown> = {};

//   /**
//    * Preferred dynamic response.
//    */
//   if (
//     raw.values &&
//     typeof raw.values === "object" &&
//     !Array.isArray(raw.values)
//   ) {
//     values = {
//       ...(raw.values as Record<string, unknown>),
//     };
//   } else {
//     /**
//      * Backward compatibility.
//      */
//     schema.fields.forEach((field) => {
//       if (field.key in raw) {
//         values[field.key] = raw[field.key];
//       }
//     });
//   }

//   /**
//    * Make sure every schema field exists.
//    */
//   schema.fields.forEach((field) => {
//     if (!(field.key in values)) {
//       values[field.key] = "";
//     }
//   });

//   return {
//     row: rowNumber,
//     values,
//   };
// }

// const WorkEntriesTable = ({
//   setEditData,
//   googleScriptUrl,
//   googleSheetUrl,
//   schema,
//   isEdit,
// }: Props) => {
//   const [entries, setEntries] = useState<IWorkEntryType[]>([]);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");

//   /**
//    * Single delete loading.
//    */
//   const [deletingRow, setDeletingRow] = useState<number | null>(null);

//   /**
//    * Multiple delete loading.
//    */
//   const [deletingMultiple, setDeletingMultiple] = useState(false);

//   /**
//    * Selected rows.
//    */
//   const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

//   /**
//    * ============================
//    * TABLE FIELDS
//    * ============================
//    */

//   const tableFields = useMemo(() => {
//     if (!schema || !Array.isArray(schema.fields)) {
//       return [];
//     }

//     return schema.fields.filter((field) => field.table !== false);
//   }, [schema]);

//   /**
//    * ============================
//    * LOAD ENTRIES
//    * ============================
//    */

//   const loadEntries = useCallback(async () => {
//     if (!googleScriptUrl?.trim()) {
//       setEntries([]);
//       setError("Google Apps Script URL is not configured.");
//       setLoading(false);
//       return;
//     }

//     if (!schema || !Array.isArray(schema.fields)) {
//       setEntries([]);
//       setError("Invalid tracker schema.");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const data = await getWorkEntries(googleScriptUrl);

//       if (!Array.isArray(data)) {
//         throw new Error("Google Script returned invalid work entries data.");
//       }

//       const normalizedEntries = data
//         .map((entry) => normalizeEntry(entry, schema))
//         .filter((entry): entry is IWorkEntryType => entry !== null);

//       setEntries(normalizedEntries);

//       /**
//        * Clear selections whenever
//        * fresh data is loaded.
//        */
//       setSelectedRows(new Set());

//       if (data.length > 0 && normalizedEntries.length === 0) {
//         setError(
//           "Google Script returned work entries, but their data format is invalid.",
//         );
//       }
//     } catch (error) {
//       console.error("Failed to load work entries:", error);

//       setEntries([]);

//       setSelectedRows(new Set());

//       setError(
//         error instanceof Error ? error.message : "Failed to load work entries.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [googleScriptUrl, schema]);

//   useEffect(() => {
//     loadEntries();
//   }, [loadEntries]);

//   /**
//    * ============================
//    * SELECTION
//    * ============================
//    */

//   const entryRows = useMemo(
//     () =>
//       entries
//         .map((entry) => entry.row)
//         .filter((row) => Number.isInteger(row) && row > 0),
//     [entries],
//   );

//   const allSelected =
//     entryRows.length > 0 && entryRows.every((row) => selectedRows.has(row));

//   const someSelected =
//     entryRows.some((row) => selectedRows.has(row)) && !allSelected;

//   /**
//    * Select / unselect one row.
//    */
//   const toggleRowSelection = (row: number) => {
//     setSelectedRows((previous) => {
//       const next = new Set(previous);

//       if (next.has(row)) {
//         next.delete(row);
//       } else {
//         next.add(row);
//       }

//       return next;
//     });
//   };

//   /**
//    * Select / unselect all.
//    */
//   const toggleSelectAll = () => {
//     setSelectedRows(() => {
//       /**
//        * If everything is selected,
//        * clear everything.
//        */
//       if (allSelected) {
//         return new Set();
//       }

//       /**
//        * Otherwise select all rows.
//        */
//       return new Set(entryRows);
//     });
//   };

//   /**
//    * ============================
//    * SINGLE DELETE
//    * ============================
//    */

//   const handleDelete = async (entry: IWorkEntryType) => {
//     if (!entry || typeof entry !== "object") {
//       setError("Invalid work entry.");
//       return;
//     }

//     if (
//       typeof entry.row !== "number" ||
//       !Number.isFinite(entry.row) ||
//       entry.row <= 0
//     ) {
//       setError("Could not identify this work entry.");
//       return;
//     }

//     /**
//      * Store row in a local constant.
//      *
//      * This also guarantees TypeScript
//      * sees it as a number.
//      */
//     const row = entry.row;

//     const values = entry.values || {};

//     const possibleDisplayFields = [
//       "task",
//       "title",
//       "name",
//       "description",
//       "project",
//       "customer",
//       "work",
//     ];

//     let displayValue = "this work entry";

//     for (const key of possibleDisplayFields) {
//       const value = values[key];

//       if (
//         value !== undefined &&
//         value !== null &&
//         String(value).trim() !== ""
//       ) {
//         displayValue = String(value);
//         break;
//       }
//     }

//     if (displayValue === "this work entry") {
//       const firstValue = Object.values(values).find(
//         (value) =>
//           value !== undefined && value !== null && String(value).trim() !== "",
//       );

//       if (firstValue !== undefined) {
//         displayValue = String(firstValue);
//       }
//     }

//     const confirmed = window.confirm(
//       `Are you sure you want to delete "${displayValue}"?`,
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       setDeletingRow(row);
//       setError("");

//       if (!googleScriptUrl?.trim()) {
//         throw new Error("Google Apps Script URL is not configured.");
//       }

//       await deleteWorkEntry(googleScriptUrl, row);

//       await loadEntries();

//       setEditData(null);
//     } catch (error) {
//       console.error("Failed to delete work entry:", error);

//       setError(
//         error instanceof Error ? error.message : "Failed to delete work entry.",
//       );
//     } finally {
//       setDeletingRow(null);
//     }
//   };

//   /**
//    * ============================
//    * MULTIPLE DELETE
//    * ============================
//    */

//   const handleDeleteSelected = async () => {
//     const rows = Array.from(selectedRows).filter(
//       (row) => Number.isInteger(row) && row > 0,
//     );

//     if (rows.length === 0) {
//       setError("Please select at least one work entry.");
//       return;
//     }

//     const confirmed = window.confirm(
//       `Are you sure you want to delete ${rows.length} selected work ${
//         rows.length === 1 ? "entry" : "entries"
//       }?`,
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       setDeletingMultiple(true);
//       setError("");

//       if (!googleScriptUrl?.trim()) {
//         throw new Error("Google Apps Script URL is not configured.");
//       }

//       /**
//        * Send actual Google Sheet row
//        * numbers to Apps Script.
//        *
//        * Apps Script deletes from bottom
//        * to top, so row shifting is safe.
//        */
//       await deleteMultipleWorkEntries(googleScriptUrl, rows);

//       /**
//        * Clear selection immediately.
//        */
//       setSelectedRows(new Set());

//       /**
//        * Reload Google Sheet data.
//        *
//        * This also gets the new sequential
//        * SI NO values.
//        */
//       await loadEntries();

//       /**
//        * Exit edit mode if needed.
//        */
//       setEditData(null);
//     } catch (error) {
//       console.error("Failed to delete selected work entries:", error);

//       setError(
//         error instanceof Error
//           ? error.message
//           : "Failed to delete selected work entries.",
//       );
//     } finally {
//       setDeletingMultiple(false);
//     }
//   };

//   /**
//    * ============================
//    * FORMAT VALUE
//    * ============================
//    */

//   function formatValue(field: ITaskTrackerField, value: unknown) {
//     if (value === undefined || value === null || String(value).trim() === "") {
//       return "-";
//     }

//     /**
//      * URL
//      */
//     if (field.type === "url") {
//       const url = String(value).trim();

//       try {
//         const parsedUrl = new URL(url);

//         return (
//           <a
//             href={parsedUrl.toString()}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 hover:underline"
//           >
//             Open
//           </a>
//         );
//       } catch {
//         return (
//           <span className="truncate" title={url}>
//             {url}
//           </span>
//         );
//       }
//     }

//     /**
//      * Number
//      */
//     if (field.type === "number") {
//       return String(value);
//     }

//     /**
//      * Date/time
//      */
//     if (field.type === "datetime") {
//       return formatSubmittedAt(String(value));
//     }

//     /**
//      * Date
//      */
//     if (field.type === "date") {
//       const dateValue = String(value).trim();

//       if (!dateValue) {
//         return "-";
//       }

//       return (
//         <MyClock
//           date={dateValue}
//           showTime={false}
//           className="text-[11px] text-slate-600"
//         />
//       );
//     }

//     /**
//      * Visual priority badge.
//      */
//     if (field.key === "priority") {
//       return <PriorityBadge priority={String(value)} />;
//     }

//     /**
//      * Visual status badge.
//      */
//     if (field.key === "status") {
//       return <StatusBadge status={String(value)} />;
//     }

//     return String(value);
//   }

//   /**
//    * ============================
//    * EDIT
//    * ============================
//    */

//   const handleEditDataChange = (data: IWorkEntryType | null) => {
//     setEditData(data);

//     if (data) {
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     }
//   };

//   /**
//    * ============================
//    * OPEN GOOGLE SHEET
//    * ============================
//    */

//   const handleOpenSheet = () => {
//     if (!googleSheetUrl?.trim()) {
//       setError("Google Sheet URL is not configured.");
//       return;
//     }

//     try {
//       const url = new URL(googleSheetUrl);

//       if (!url.hostname.includes("docs.google.com")) {
//         throw new Error();
//       }

//       window.open(url.toString(), "_blank", "noopener,noreferrer");
//     } catch {
//       setError("The configured Google Sheet URL is invalid.");
//     }
//   };

//   /**
//    * ============================
//    * RENDER
//    * ============================
//    */

//   return (
//     <section className="mt-8 space-y-3 overflow-hidden">
//       {/* HEADER */}

//       <div className="flex flex-wrap items-center gap-2">
//         <Button
//           type="button"
//           onClick={loadEntries}
//           disabled={loading || deletingMultiple}
//           className="h-9 gap-1.5 px-3 text-sm"
//         >
//           <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
//           Refresh
//         </Button>

//         <Button
//           type="button"
//           aria-label="Open Google Sheet"
//           className="h-9 gap-1.5 bg-green-700 px-3 text-sm hover:bg-green-800"
//           onClick={handleOpenSheet}
//           disabled={deletingMultiple}
//         >
//           <RiFileExcel2Fill size={15} />
//           Sheet
//         </Button>
//       </div>

//       {/* ERROR */}

//       {!loading && error && (
//         <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
//           {error}
//         </div>
//       )}

//       {/* LOADING */}

//       {loading && (
//         <div className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white">
//           <div className="text-sm text-slate-500">Loading work entries...</div>
//         </div>
//       )}

//       {/* EMPTY */}

//       {!loading && !error && entries.length === 0 && (
//         <div className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white">
//           <div className="text-center">
//             <p className="font-medium text-slate-700">No work entries found</p>

//             <p className="mt-1 text-sm text-slate-500">
//               Submit your first work entry to see it here.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* TABLE */}

//       {!loading && !error && entries.length > 0 && tableFields.length > 0 && (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="max-h-[calc(100vh-280px)] overflow-auto">
//             <table className="min-w-[1100px] w-full table-auto text-left text-xs">
//               <thead className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm">
//                 <tr className="border-b border-slate-200">
//                   {/* SELECT ALL */}

//                   <th className="sticky left-0 z-30 w-10 bg-slate-50/95 px-2 py-2">
//                     <Checkbox
//                       checked={
//                         allSelected
//                           ? true
//                           : someSelected
//                             ? "indeterminate"
//                             : false
//                       }
//                       onCheckedChange={toggleSelectAll}
//                       disabled={deletingMultiple}
//                       aria-label="Select all work entries"
//                     />
//                   </th>

//                   {/* DYNAMIC FIELDS */}

//                   {tableFields.map((field) => (
//                     <th
//                       key={field.key}
//                       className="whitespace-nowrap px-3 py-2 font-semibold text-[11px] uppercase tracking-wide text-slate-500"
//                     >
//                       {field.label}
//                     </th>
//                   ))}

//                   {/* ACTION */}

//                   <th className="whitespace-nowrap px-3 py-2 font-semibold text-[11px] uppercase tracking-wide text-slate-500">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {entries.map((entry, index) => {
//                   if (!entry || !entry.values) {
//                     return null;
//                   }

//                   const isDeleting = deletingRow === entry.row;

//                   const isSelected = selectedRows.has(entry.row);

//                   return (
//                     <tr
//                       key={`${entry.row}-${index}`}
//                       className={`border-b border-slate-100 last:border-0 transition-colors ${
//                         isSelected ? "bg-blue-50/70" : "hover:bg-slate-50"
//                       }`}
//                     >
//                       {/* ROW CHECKBOX */}

//                       <td className="w-10 px-2 py-2 align-middle">
//                         <Checkbox
//                           checked={isSelected}
//                           onCheckedChange={() => toggleRowSelection(entry.row)}
//                           disabled={isDeleting || deletingMultiple}
//                           aria-label={`Select row ${entry.row}`}
//                         />
//                       </td>

//                       {/* DYNAMIC FIELDS */}

//                       {tableFields.map((field) => (
//                         <td
//                           key={`${entry.row}-${field.key}`}
//                           className="max-w-64 px-3 py-2 align-middle text-xs leading-4 text-slate-700"
//                         >
//                           {formatValue(field, entry.values?.[field.key])}
//                         </td>
//                       ))}

//                       {/* ACTION */}

//                       <td className="whitespace-nowrap px-3 py-2 align-middle">
//                         <div className="flex items-center gap-2">
//                           {/* EDIT */}

//                           <button
//                             type="button"
//                             onClick={() => handleEditDataChange(entry)}
//                             disabled={isDeleting || deletingMultiple}
//                             className="inline-flex h-7 items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 text-[11px] font-medium text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
//                           >
//                             {isEdit ? (
//                               <>
//                                 <MdCancel />
//                                 Cancel
//                               </>
//                             ) : (
//                               <>
//                                 <Pencil size={14} />
//                                 Edit
//                               </>
//                             )}
//                           </button>

//                           {/* SINGLE DELETE */}

//                           <button
//                             type="button"
//                             onClick={() => handleDelete(entry)}
//                             disabled={isDeleting || deletingMultiple}
//                             className="inline-flex h-7 items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 text-[11px] font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
//                           >
//                             <Trash2 size={14} />

//                             {isDeleting ? "Deleting..." : "Delete"}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* INVALID SCHEMA */}

//       {!loading && !error && tableFields.length === 0 && (
//         <div className="flex min-h-40 items-center justify-center rounded-2xl border border-red-100 bg-red-50">
//           <div className="text-center">
//             <p className="font-medium text-red-700">
//               No table fields available
//             </p>

//             <p className="mt-1 text-sm text-red-600">
//               The configured Google Script returned an invalid or empty schema.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* FLOATING BULK DELETE ACTION */}

//       {selectedRows.size > 0 && (
//         <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur-md">
//           <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
//             <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-900 px-2 text-xs font-semibold text-white">
//               {selectedRows.size}
//             </span>

//             <span className="text-xs font-medium text-slate-600">selected</span>
//           </div>

//           <Button
//             type="button"
//             variant="destructive"
//             onClick={handleDeleteSelected}
//             disabled={deletingMultiple || deletingRow !== null}
//             className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold shadow-sm"
//           >
//             <Trash2 size={14} />

//             {deletingMultiple ? "Deleting..." : "Delete Selected"}
//           </Button>
//         </div>
//       )}
//     </section>
//   );
// };

// /**
//  * ============================
//  * PRIORITY
//  * ============================
//  */

// function PriorityBadge({ priority }: { priority: string }) {
//   const styles: Record<string, string> = {
//     Low: "bg-blue-50 text-blue-600",
//     Medium: "bg-yellow-50 text-yellow-700",
//     High: "bg-orange-50 text-orange-600",
//     Urgent: "bg-red-50 text-red-600",
//   };

//   return (
//     <span
//       className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//         styles[priority] || "bg-slate-100 text-slate-600"
//       }`}
//     >
//       {priority || "-"}
//     </span>
//   );
// }

// /**
//  * ============================
//  * STATUS
//  * ============================
//  */

// function StatusBadge({ status }: { status: string }) {
//   const styles: Record<string, string> = {
//     "Not Started": "bg-slate-100 text-slate-600",

//     "In Progress": "bg-blue-50 text-blue-600",

//     Completed: "bg-emerald-50 text-emerald-600",

//     Blocked: "bg-red-50 text-red-600",
//   };

//   return (
//     <span
//       className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//         styles[status] || "bg-slate-100 text-slate-600"
//       }`}
//     >
//       {status || "-"}
//     </span>
//   );
// }

// /**
//  * ============================
//  * DATETIME
//  * ============================
//  */

// function formatSubmittedAt(value?: string) {
//   if (!value) {
//     return "-";
//   }

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return value;
//   }

//   return date.toLocaleString("en-IN", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });
// }

// export default WorkEntriesTable;
