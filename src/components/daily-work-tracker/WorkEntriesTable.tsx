import { useCallback, useEffect, useMemo, useState } from "react";

import { Pencil, RefreshCw, Trash2 } from "lucide-react";

import {
  ITaskTrackerField,
  ITaskTrackerSchema,
  IWorkEntryType,
} from "@/types/taskTracker";

import {
  deleteWorkEntry,
  getWorkEntries,
} from "@/services/spread-sheet/taskTrackerApi";

import MyClock from "../global/clock";
import { Button } from "../ui/button";
import { RiFileExcel2Fill } from "react-icons/ri";

type Props = {
  setEditData: (data: IWorkEntryType | null) => void;

  googleScriptUrl: string;
  googleSheetUrl: string;

  schema: ITaskTrackerSchema;
};

/**
 * Convert any Google Script response into the
 * structure expected by the React application.
 *
 * Supports both:
 *
 * NEW:
 * {
 *   row: 8,
 *   values: {
 *     date: "...",
 *     project: "..."
 *   }
 * }
 *
 * OLD:
 * {
 *   row: 8,
 *   date: "...",
 *   project: "..."
 * }
 */
function normalizeEntry(
  rawEntry: unknown,
  schema: ITaskTrackerSchema,
): IWorkEntryType | null {
  if (!rawEntry || typeof rawEntry !== "object") {
    return null;
  }

  const raw = rawEntry as Record<string, unknown>;

  const rowNumber = Number(raw.row);

  if (!Number.isFinite(rowNumber) || rowNumber <= 0) {
    return null;
  }

  let values: Record<string, unknown> = {};

  /**
   * Preferred dynamic response.
   */
  if (
    raw.values &&
    typeof raw.values === "object" &&
    !Array.isArray(raw.values)
  ) {
    values = {
      ...(raw.values as Record<string, unknown>),
    };
  } else {
    /**
     * Backward compatibility with the old
     * flat Apps Script response.
     */
    schema.fields.forEach((field) => {
      if (field.key in raw) {
        values[field.key] = raw[field.key];
      }
    });
  }

  /**
   * Make sure every schema field exists.
   *
   * This prevents undefined-related crashes
   * when the Sheet does not contain a value.
   */
  schema.fields.forEach((field) => {
    if (!(field.key in values)) {
      values[field.key] = "";
    }
  });

  return {
    row: rowNumber,
    values,
  };
}

const WorkEntriesTable = ({
  setEditData,
  googleScriptUrl,
  googleSheetUrl,
  schema,
}: Props) => {
  const [entries, setEntries] = useState<IWorkEntryType[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingRow, setDeletingRow] = useState<number | null>(null);

  /**
   * ============================
   * SAFE TABLE FIELDS
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
   * LOAD ENTRIES
   * ============================
   */

  const loadEntries = useCallback(async () => {
    if (!googleScriptUrl?.trim()) {
      setEntries([]);
      setError("Google Apps Script URL is not configured.");
      setLoading(false);
      return;
    }

    if (!schema || !Array.isArray(schema.fields)) {
      setEntries([]);
      setError("Invalid tracker schema.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getWorkEntries(googleScriptUrl);

      /**
       * API should return an array.
       */
      if (!Array.isArray(data)) {
        throw new Error("Google Script returned invalid work entries data.");
      }

      /**
       * Normalize every entry and remove
       * malformed rows instead of crashing.
       */
      const normalizedEntries = data
        .map((entry) => normalizeEntry(entry, schema))
        .filter((entry): entry is IWorkEntryType => entry !== null);

      setEntries(normalizedEntries);

      /**
       * If Google Script returned rows but
       * every row was malformed, show a useful error.
       */
      if (data.length > 0 && normalizedEntries.length === 0) {
        setError(
          "Google Script returned work entries, but their data format is invalid.",
        );
      }
    } catch (error) {
      console.error("Failed to load work entries:", error);

      setEntries([]);

      setError(
        error instanceof Error ? error.message : "Failed to load work entries.",
      );
    } finally {
      setLoading(false);
    }
  }, [googleScriptUrl, schema]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  /**
   * ============================
   * DELETE
   * ============================
   */

  const handleDelete = async (entry: IWorkEntryType) => {
    if (!entry || typeof entry !== "object") {
      setError("Invalid work entry.");
      return;
    }

    if (
      typeof entry.row !== "number" ||
      !Number.isFinite(entry.row) ||
      entry.row <= 0
    ) {
      setError("Could not identify this work entry.");
      return;
    }

    /**
     * Safely get a useful name for confirmation.
     *
     * No hard dependency on "task".
     */
    const values = entry.values || {};

    const possibleDisplayFields = [
      "task",
      "title",
      "name",
      "description",
      "project",
      "customer",
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

    /**
     * If none of the common fields exist,
     * use the first available value dynamically.
     */
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
      setDeletingRow(entry.row);
      setError("");

      if (!googleScriptUrl?.trim()) {
        throw new Error("Google Apps Script URL is not configured.");
      }

      await deleteWorkEntry(googleScriptUrl, entry.row);

      /**
       * Reload from Google Sheet.
       *
       * This also refreshes row numbers after
       * Google Sheets deletes a row.
       */
      await loadEntries();

      setEditData(null);
    } catch (error) {
      console.error("Failed to delete work entry:", error);

      setError(
        error instanceof Error ? error.message : "Failed to delete work entry.",
      );
    } finally {
      setDeletingRow(null);
    }
  };

  /**
   * ============================
   * FORMAT VALUE
   * ============================
   */

  function formatValue(field: ITaskTrackerField, value: unknown) {
    /**
     * Empty / missing value.
     */
    if (value === undefined || value === null || String(value).trim() === "") {
      return "-";
    }

    /**
     * URL
     */
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
        /**
         * Do not crash because of an invalid URL.
         */
        return (
          <span className="truncate" title={url}>
            {url}
          </span>
        );
      }
    }

    /**
     * Number
     */
    if (field.type === "number") {
      return String(value);
    }

    /**
     * Date/time
     */
    if (field.type === "datetime") {
      return formatSubmittedAt(String(value));
    }

    /**
     * Date
     */
    if (field.type === "date") {
      const dateValue = String(value).trim();

      if (!dateValue) {
        return "-";
      }

      return (
        <MyClock
          date={dateValue}
          showTime={false}
          className="text-xs text-slate-700"
        />
      );
    }

    /**
     * These are only visual enhancements.
     *
     * They do NOT affect the dynamic schema.
     */
    if (field.key === "priority") {
      return <PriorityBadge priority={String(value)} />;
    }

    if (field.key === "status") {
      return <StatusBadge status={String(value)} />;
    }

    /**
     * Default
     */
    return String(value);
  }

  /**
   * ============================
   * SAFE GOOGLE SHEET OPEN
   * ============================
   */

  const handleOpenSheet = () => {
    if (!googleSheetUrl?.trim()) {
      setError("Google Sheet URL is not configured.");
      return;
    }

    try {
      const url = new URL(googleSheetUrl);

      if (!url.hostname.includes("docs.google.com")) {
        throw new Error();
      }

      window.open(url.toString(), "_blank", "noopener,noreferrer");
    } catch {
      setError("The configured Google Sheet URL is invalid.");
    }
  };

  /**
   * ============================
   * RENDER
   * ============================
   */

  return (
    <section className="mt-8 space-y-3 overflow-hidden">
      {/* HEADER */}

      <div className="flex items-center sm:gap-3">
        <Button
          type="button"
          onClick={loadEntries}
          disabled={loading}
          className="max-sm:w-1/2 max-sm:rounded-none"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>

        <Button
          type="button"
          aria-label="Open Google Sheet"
          className="flex items-center gap-1 bg-green-700 max-sm:w-1/2 max-sm:rounded-none"
          onClick={handleOpenSheet}
        >
          <RiFileExcel2Fill />
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
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  {tableFields.map((field) => (
                    <th
                      key={field.key}
                      className="whitespace-nowrap px-5 py-3 font-semibold text-slate-600"
                    >
                      {field.label}
                    </th>
                  ))}

                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-slate-600">
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

                  return (
                    <tr
                      key={`${entry.row}-${index}`}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      {tableFields.map((field) => (
                        <td
                          key={`${entry.row}-${field.key}`}
                          className="max-w-80 px-5 py-4 text-slate-700"
                        >
                          {formatValue(field, entry.values?.[field.key])}
                        </td>
                      ))}

                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2">
                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() => {
                              if (!entry.values) {
                                setError(
                                  "This work entry does not contain valid values.",
                                );
                                return;
                              }

                              setEditData(entry);
                            }}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() => handleDelete(entry)}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
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
    </section>
  );
};

/**
 * ============================
 * PRIORITY
 * ============================
 */

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

/**
 * ============================
 * STATUS
 * ============================
 */

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

/**
 * ============================
 * DATETIME
 * ============================
 */

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
