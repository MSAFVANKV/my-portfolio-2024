"use client";

import { useState } from "react";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbybugEQSIZn2Tme_wsBXsbHcdacFixHDmBnmiZYCOQSYRohhAzXLUMirwx95VnfsvkScQ/exec";

type WorkEntry = {
  date: string;
  project: string;
  task: string;
  category: string;
  priority: string;
  status: string;
  hours: string;
  notes: string;
};

const initialEntry: WorkEntry = {
  date:
    new Date().getFullYear() +
    "-" +
    String(new Date().getMonth() + 1).padStart(2, "0") +
    "-" +
    String(new Date().getDate()).padStart(2, "0"),
  project: "",
  task: "",
  category: "Development",
  priority: "Medium",
  status: "In Progress",
  hours: "1",
  notes: "",
};

export default function DailyWorkTracker() {
  const [form, setForm] = useState<WorkEntry>(initialEntry);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (GOOGLE_SCRIPT_URL.startsWith("YOUR_")) {
      setMessage("Please configure your Google Apps Script URL first.");
      return;
    }

    setSubmitting(true);

    try {
      // no-cors allows this simple POST to be sent without
      // requiring browser-readable CORS headers.
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          ...form,
          hours: Number(form.hours),
        }),
      });

      setMessage(
        "Submission sent. Please check your Google Sheet to confirm the entry.",
      );

      setForm({
        ...initialEntry,
        date: form.date,
      });
    } catch {
      setMessage(
        "Could not send the submission. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full  my-10 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  const labelClass = "block text-sm font-medium text-slate-700";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
            📋
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Daily Work Tracker
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Record your daily tasks and track your work progress.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 px-5 py-4 sm:px-8">
            <h2 className="font-semibold text-slate-900">Work entry</h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill in the details below.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-8">
            <div>
              <label className={labelClass} htmlFor="date">
                Work date *
              </label>
              <input
                className={inputClass}
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="project">
                Project *
              </label>
              <input
                className={inputClass}
                id="project"
                name="project"
                placeholder="e.g. Travalet Web UI"
                value={form.project}
                onChange={handleChange}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="task">
                Task title *
              </label>
              <input
                className={inputClass}
                id="task"
                name="task"
                placeholder="e.g. Fixed package policy validation"
                value={form.task}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="category">
                Work category
              </label>
              <select
                className={inputClass}
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>Development</option>
                <option>Bug Fix</option>
                <option>Testing</option>
                <option>Code Review</option>
                <option>Learning</option>
                <option>Meeting</option>
                <option>Documentation</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="status">
                Status
              </label>
              <select
                className={inputClass}
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Blocked</option>
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="priority">
                Priority
              </label>
              <select
                className={inputClass}
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="hours">
                Hours spent *
              </label>
              <input
                className={inputClass}
                id="hours"
                name="hours"
                type="number"
                min="0.25"
                max="24"
                step="0.25"
                value={form.hours}
                onChange={handleChange}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="notes">
                Work details / notes
              </label>
              <textarea
                className={inputClass}
                id="notes"
                name="notes"
                rows={4}
                placeholder="What did you complete? Any blockers or follow-up tasks?"
                value={form.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          {message && (
            <div
              role="status"
              className="mx-5 mb-5 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 sm:mx-8"
            >
              {message}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <button
              type="button"
              onClick={() => {
                setForm(initialEntry);
                setMessage("");
              }}
              disabled={submitting}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Clear form
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit work entry"}
              {!submitting && <span aria-hidden="true">→</span>}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Work entries are sent to your configured Google Sheet.
        </p>
      </div>
    </main>
  );
}
