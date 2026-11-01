import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { IWorkEntryType } from "@/types/taskTracker";
import { getWorkEntries } from "@/services/spread-sheet/taskTrackerApi";
import MyClock from "../global/clock";

const WorkEntriesTable = () => {
  const [entries, setEntries] = useState<IWorkEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getWorkEntries();

      setEntries(data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to load work entries.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-semibold text-slate-900">Work Entries</h2>

          <p className="mt-1 text-sm text-slate-500">
            All your submitted work entries.
          </p>
        </div>

        <button
          type="button"
          onClick={loadEntries}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-40 items-center justify-center">
          <div className="text-sm text-slate-500">Loading work entries...</div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="m-5 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && entries.length === 0 && (
        <div className="flex min-h-40 items-center justify-center">
          <div className="text-center">
            <p className="font-medium text-slate-700">No work entries found</p>

            <p className="mt-1 text-sm text-slate-500">
              Submit your first work entry to see it here.
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && entries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-3 font-semibold text-slate-600">Date</th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Project
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">Task</th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Category
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Priority
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Status
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Hours
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Notes
                </th>

                <th className="px-5 py-3 font-semibold text-slate-600">
                  Submitted At
                </th>
              </tr>
            </thead>

            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={`${entry.submittedAt}-${index}`}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                    <MyClock
                      date={entry.date}
                      showTime
                      className="text-slate-700 text-xs"
                    />
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-800">
                    {entry.project}
                  </td>

                  <td className="min-w-64 px-5 py-4 text-slate-700">
                    {entry.task}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {entry.category}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <PriorityBadge priority={entry.priority} />
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <StatusBadge status={entry.status} />
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700">
                    {entry.hours}h
                  </td>

                  <td className="max-w-80 px-5 py-4 text-slate-600">
                    <p className="line-clamp-2">{entry.notes || "-"}</p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {formatSubmittedAt(entry.submittedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {!loading && !error && entries.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-sm text-slate-500">
          {entries.length} work {entries.length === 1 ? "entry" : "entries"}
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

function formatSubmittedAt(value: string) {
  if (!value) return "-";

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
