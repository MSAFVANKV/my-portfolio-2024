"use client";

import React, { useEffect, useState } from "react";

// Types
type Session = {
  start: string;
  end: string;
};

type CompletedRecord = {
  id: string;
  date: string;
  workSessions: Session[];
  idleSessions: Session[];
  totalWorkMs: number;
  totalIdleMs: number;
  addedMs?: number; // Tracks manually added time offsets inside the saved history log
};

const STORAGE_KEY = "time-runner-v2";

// Live office clock matching the compact digital + analog clock UI
// Live office clock with dynamic location
const LiveOfficeClock = () => {
  const [now, setNow] = useState(new Date());
  const [location, setLocation] = useState("Detecting location...");
  const [locationLoading, setLocationLoading] = useState(true);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

//   const city =
//     timeZone === "Asia/Kolkata" || timeZone === "Asia/Calcutta"
//       ? "India"
//       : timeZone.split("/").pop()?.replace(/_/g, " ") || timeZone;

  // Update clock every second
  useEffect(() => {
    const updateClock = () => {
      setNow(new Date());
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get user's actual location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(
        Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown location",
      );
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                Accept: "application/json",
              },
            },
          );

          if (!response.ok) {
            throw new Error("Failed to reverse geocode location");
          }

          const data = await response.json();

          const address = data?.address;

          const city =
            address?.city ||
            address?.town ||
            address?.village ||
            address?.municipality ||
            address?.county ||
            "";

          const state = address?.state || "";

          const countryCode = address?.country_code
            ? address.country_code.toUpperCase()
            : "";

          const locationParts = [city, state, countryCode].filter(Boolean);

          if (locationParts.length > 0) {
            setLocation(locationParts.join(", "));
          } else {
            setLocation(
              Intl.DateTimeFormat().resolvedOptions().timeZone ||
                "Unknown location",
            );
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error);

          setLocation(
            Intl.DateTimeFormat().resolvedOptions().timeZone ||
              "Unknown location",
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Location permission/error:", error);

        // Fallback to browser timezone
        setLocation(
          Intl.DateTimeFormat().resolvedOptions().timeZone ||
            "Unknown location",
        );

        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const displayHours = hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";

  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  // Calculate current UTC offset
  const offsetMinutes = -now.getTimezoneOffset();

  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetRemainingMinutes = Math.abs(offsetMinutes) % 60;

  const offsetSign = offsetMinutes >= 0 ? "+" : "-";

  const offsetText =
    offsetRemainingMinutes === 0
      ? `${offsetSign}${offsetHours}hrs`
      : `${offsetSign}${offsetHours}.${offsetRemainingMinutes === 30 ? "5" : String(offsetRemainingMinutes / 60).replace("0.", "")}hrs`;

  return (
    <div className="flex h-[150px] w-full items-center justify-between rounded-[24px] bg-[#1d1d1d] px-5 py-4 text-white shadow-sm">
      {/* Digital information */}
      <div className="flex min-w-0 flex-col">
        <p className="font-sans text-[25px] font-semibold leading-none tracking-tight">
          {displayHours}:{String(minutes).padStart(2, "0")} {period}
        </p>

        <p className="mt-3 truncate text-[11px] text-gray-300">
          {locationLoading
            ? "Detecting location..."
            : `${location} - ${timeZone}`}
        </p>

        <p className="mt-0.5 text-[10px] text-gray-400">Today, {offsetText}</p>
      </div>

      {/* Analog clock */}
      <div className="relative h-[82px] w-[82px] shrink-0">
        {/* Clock numbers */}
        <div className="absolute inset-0 rounded-full">
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((number) => {
            const angle = (number * 30 - 90) * (Math.PI / 180);

            const radius = 34;

            const x = 41 + Math.cos(angle) * radius;
            const y = 41 + Math.sin(angle) * radius;

            return (
              <span
                key={number}
                className="absolute -translate-x-1/2 -translate-y-1/2 font-sans text-[10px] font-semibold text-gray-200"
                style={{
                  left: x,
                  top: y,
                }}
              >
                {number}
              </span>
            );
          })}
        </div>

        {/* Hour hand */}
        <div
          className="absolute left-1/2 top-1/2 h-[25px] w-[2px] origin-bottom rounded-full bg-gray-200"
          style={{
            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
          }}
        />

        {/* Minute hand */}
        <div
          className="absolute left-1/2 top-1/2 h-[34px] w-[2px] origin-bottom rounded-full bg-gray-200"
          style={{
            transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
          }}
        />

        {/* Second hand */}
        <div
          className="absolute left-1/2 top-1/2 h-[38px] w-[1px] origin-bottom rounded-full bg-sky-400"
          style={{
            transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
          }}
        />

        {/* Center dot */}
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400" />
      </div>
    </div>
  );
};

// A beautifully styled local clock component that formats timestamps cleanly
const MyClock = ({
  date,
  showSeconds = true,
}: {
  date: string;
  showSeconds?: boolean;
  showTime?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
}) => {
  if (!date) return <span className="font-mono text-gray-400">--:--:--</span>;
  try {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    const timeStr = showSeconds
      ? `${hours}:${minutes}:${seconds}`
      : `${hours}:${minutes}`;

    return (
      <span className="rounded border border-gray-200/50 bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700 dark:border-gray-700/50 dark:bg-gray-800 dark:text-gray-300">
        {timeStr}
      </span>
    );
  } catch (e) {
    return <span className="text-xs text-red-500">Invalid Date</span>;
  }
};

const TimeRunnerV02 = () => {
  const [status, setStatus] = useState<"stopped" | "running" | "paused">(
    "stopped",
  );
  const [workStart, setWorkStart] = useState<string | null>(null);
  const [idleStart, setIdleStart] = useState<string | null>(null);
  const [workSessions, setWorkSessions] = useState<Session[]>([]);
  const [idleSessions, setIdleSessions] = useState<Session[]>([]);
  const [history, setHistory] = useState<CompletedRecord[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [addedMs, setAddedMs] = useState(0); // Persistent state tracking manually added time in ms

  // Custom input states for adding extra manual time
  const [inputHours, setInputHours] = useState("");
  const [inputMinutes, setInputMinutes] = useState("");
  const [inputSeconds, setInputSeconds] = useState("");

  // Mounted flag ensures we do not write initial state to localStorage on load,
  // which prevents data wipeouts on tab refresh/re-entry.
  const [mounted, setMounted] = useState(false);

  // Live timer for current workspace session tracking
  useEffect(() => {
    const updateElapsed = () => {
      const previous = workSessions.reduce((sum, item) => {
        return (
          sum + (new Date(item.end).getTime() - new Date(item.start).getTime())
        );
      }, 0);

      let current = 0;
      if (status === "running" && workStart) {
        current = Date.now() - new Date(workStart).getTime();
      }

      setElapsed(previous + current + addedMs);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    // Instantly catch up on background tab freeze/sleep when returning to page
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateElapsed();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [status, workStart, workSessions, addedMs]);

  // Phase 1: Read state from localStorage only ONCE on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setStatus(data.status || "stopped");
        setWorkStart(data.workStart || null);
        setIdleStart(data.idleStart || null);
        setWorkSessions(data.workSessions || []);
        setIdleSessions(data.idleSessions || []);
        setHistory(data.history || []);
        const restoredAddedMs = data.addedMs || 0;
        setAddedMs(restoredAddedMs);

        // Calculate elapsed time immediately upon hydration
        const previous = (data.workSessions || []).reduce(
          (sum: number, item: Session) =>
            sum +
            (new Date(item.end).getTime() - new Date(item.start).getTime()),
          0,
        );

        let current = 0;
        if (data.status === "running" && data.workStart) {
          current = Date.now() - new Date(data.workStart).getTime();
        }
        setElapsed(previous + current + restoredAddedMs);
      } catch (e) {
        console.error("Error restoring from storage:", e);
      }
    }
    // Set mounted to true AFTER state has successfully hydrated
    setMounted(true);
  }, []);

  // Phase 2: Save active state updates to localStorage only after safe hydration is complete
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        status,
        workStart,
        idleStart,
        workSessions,
        idleSessions,
        history,
        addedMs,
      }),
    );
  }, [
    status,
    workStart,
    idleStart,
    workSessions,
    idleSessions,
    history,
    addedMs,
    mounted,
  ]);

  // Start a completely fresh active workspace session
  const start = () => {
    if (status !== "stopped") return;

    // Clean active states for the new tracking record
    setWorkSessions([]);
    setIdleSessions([]);
    setElapsed(0);
    setAddedMs(0);

    setStatus("running");
    setWorkStart(new Date().toISOString());
  };

  const pause = () => {
    if (!workStart) return;

    const now = new Date().toISOString();
    setWorkSessions((prev) => [
      ...prev,
      {
        start: workStart,
        end: now,
      },
    ]);

    setWorkStart(null);
    setIdleStart(now);
    setStatus("paused");
  };

  const resume = () => {
    if (!idleStart) return;

    const now = new Date().toISOString();
    setIdleSessions((prev) => [
      ...prev,
      {
        start: idleStart,
        end: now,
      },
    ]);

    setIdleStart(null);
    setWorkStart(now);
    setStatus("running");
  };

  // Terminate active tracking session, compile records into history, and reset
  const stop = () => {
    if (status === "stopped") return;

    const now = new Date().toISOString();
    let finalWork = [...workSessions];
    let finalIdle = [...idleSessions];

    if (status === "running" && workStart) {
      finalWork.push({
        start: workStart,
        end: now,
      });
    }

    if (status === "paused" && idleStart) {
      finalIdle.push({
        start: idleStart,
        end: now,
      });
    }

    // Calculate totals for this individual track run
    const totalWorkMs =
      finalWork.reduce(
        (sum, s) =>
          sum + (new Date(s.end).getTime() - new Date(s.start).getTime()),
        0,
      ) + addedMs; // Add manual extra time offset inside final tracked total

    const totalIdleMs = finalIdle.reduce(
      (sum, s) =>
        sum + (new Date(s.end).getTime() - new Date(s.start).getTime()),
      0,
    );

    // Append to completed history list if there is tracked work/idle time
    if (totalWorkMs > 0 || totalIdleMs > 0) {
      const newRecord: CompletedRecord = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2, 9),
        date: new Date().toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        workSessions: finalWork,
        idleSessions: finalIdle,
        totalWorkMs,
        totalIdleMs,
        addedMs, // Save manual configuration offset for transparency
      };
      setHistory((prev) => [newRecord, ...prev]);
    }

    // Clean up current active session states
    setStatus("stopped");
    setWorkStart(null);
    setIdleStart(null);
    setWorkSessions([]);
    setIdleSessions([]);
    setElapsed(0);
    setAddedMs(0);
  };

  // Handler to inject manual time offset
  const handleAddManualTime = (
    hours: number,
    minutes: number,
    seconds: number,
  ) => {
    const hMs = hours * 3600 * 1000;
    const mMs = minutes * 60 * 1000;
    const sMs = seconds * 1000;
    const totalToAdd = hMs + mMs + sMs;

    if (totalToAdd > 0) {
      setAddedMs((prev) => prev + totalToAdd);
    }
  };

  const applyCustomTime = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseInt(inputHours) || 0;
    const m = parseInt(inputMinutes) || 0;
    const s = parseInt(inputSeconds) || 0;

    handleAddManualTime(h, m, s);

    // Reset fields
    setInputHours("");
    setInputMinutes("");
    setInputSeconds("");
  };

  const clearHistory = () => {
    if (
      window.confirm("Are you sure you want to clear your historical sessions?")
    ) {
      setHistory([]);
    }
  };

  const formatTime = (ms: number) => {
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.round(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const totalWorkMs =
    workSessions.reduce((sum, session) => {
      return (
        sum +
        (new Date(session.end).getTime() - new Date(session.start).getTime())
      );
    }, 0) + addedMs;

  const totalIdleMs = idleSessions.reduce((sum, session) => {
    return (
      sum +
      (new Date(session.end).getTime() - new Date(session.start).getTime())
    );
  }, 0);

  // Prevent server-side render mismatch before hydration completes
  if (!mounted) {
    return (
      <div className="mx-auto my-10 flex min-h-[300px] max-w-4xl items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-gray-500">
            Syncing active workspace session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-10 max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-900">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Time Runner
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track focused work sprints and intervals seamlessly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              status === "running"
                ? "animate-pulse bg-green-500"
                : status === "paused"
                  ? "animate-pulse bg-yellow-500"
                  : "bg-gray-400"
            }`}
          />
          <span className="text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-400">
            {status}
          </span>
        </div>
      </div>

      {/* live clock */}
      <LiveOfficeClock />

      {/* Main active panel */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-8 dark:border-gray-900 dark:bg-gray-900/50">
        <p className="mb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
          Active Elapsed Work Session
        </p>
        <div className="mb-6 flex items-center justify-center gap-3">
          <p className="font-mono text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {formatTime(elapsed)}
          </p>
          {addedMs > 0 && (
            <div className="flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-400">
              <span>+ {formatDuration(addedMs)} manual</span>
            </div>
          )}
        </div>

        {/* Dynamic Action Buttons */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {status === "stopped" ? (
            <button
              onClick={start}
              className="flex transform items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 active:scale-95"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start New Session
            </button>
          ) : (
            <>
              {status === "running" && (
                <button
                  onClick={pause}
                  className="flex transform items-center gap-2 rounded-lg bg-yellow-500 px-6 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-yellow-600 active:scale-95"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                  Pause (Idle)
                </button>
              )}
              {status === "paused" && (
                <button
                  onClick={resume}
                  className="flex transform items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-95"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Resume Work
                </button>
              )}
              <button
                onClick={stop}
                className="flex transform items-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 active:scale-95"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z" />
                </svg>
                Stop & Save Record
              </button>
            </>
          )}
        </div>

        {/* Adjust Active Time Dashboard Utility (Active status only) */}
        {status !== "stopped" && (
          <div className="mx-auto mt-5 max-w-xl border-t border-gray-200/60 pt-5 dark:border-gray-800/60">
            <p className="mb-3 text-xs font-bold tracking-wider text-gray-500 uppercase">
              Add Extra Work Time
            </p>

            {/* Quick Adjustment Buttons */}
            <div className="mb-4 flex justify-center gap-2">
              <button
                onClick={() => handleAddManualTime(0, 1, 0)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-100 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                +1 min
              </button>
              <button
                onClick={() => handleAddManualTime(0, 5, 0)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-100 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                +5 min
              </button>
              <button
                onClick={() => handleAddManualTime(0, 15, 0)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-100 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                +15 min
              </button>
              <button
                onClick={() => handleAddManualTime(1, 0, 0)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-100 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                +1 hour
              </button>
            </div>

            {/* Custom Input Fields */}
            <form
              onSubmit={applyCustomTime}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2 py-1 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <input
                  type="number"
                  min="0"
                  max="23"
                  placeholder="00"
                  value={inputHours}
                  onChange={(e) => setInputHours(e.target.value)}
                  className="w-10 bg-transparent text-center font-mono text-sm focus:outline-none dark:text-white"
                />
                <span className="text-xs text-gray-400">h</span>
                <span className="text-gray-300 dark:text-gray-600">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="00"
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(e.target.value)}
                  className="w-10 bg-transparent text-center font-mono text-sm focus:outline-none dark:text-white"
                />
                <span className="text-xs text-gray-400">m</span>
                <span className="text-gray-300 dark:text-gray-600">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="00"
                  value={inputSeconds}
                  onChange={(e) => setInputSeconds(e.target.value)}
                  className="w-10 bg-transparent text-center font-mono text-sm focus:outline-none dark:text-white"
                />
                <span className="text-xs text-gray-400">s</span>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 active:scale-95"
              >
                Add Manual Time
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Live active stats breakdown */}
      {status !== "stopped" && (
        <div className="mb-10 space-y-6">
          <h3 className="border-b border-gray-100 pb-2 text-lg font-bold text-gray-900 dark:border-gray-900 dark:text-white">
            Current Workspace Details
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-emerald-50/20 p-5 dark:border-gray-800 dark:bg-emerald-950/5">
              <p className="text-xs font-semibold tracking-wide text-emerald-600 uppercase dark:text-emerald-400">
                Total Active Work
              </p>
              <p className="mt-1 font-mono text-2xl font-bold">
                {formatDuration(
                  totalWorkMs +
                    (status === "running" && workStart
                      ? Date.now() - new Date(workStart).getTime()
                      : 0),
                )}
              </p>

              {workSessions.length > 0 && (
                <div className="mt-4 max-h-32 space-y-1.5 overflow-y-auto">
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Work intervals:
                  </p>
                  {workSessions.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between rounded border border-gray-100 bg-white p-1.5 text-xs dark:border-gray-800 dark:bg-gray-900"
                    >
                      <span>Interval #{index + 1}</span>
                      <div className="flex gap-1.5">
                        <MyClock date={item.start} /> to{" "}
                        <MyClock date={item.end} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-amber-50/20 p-5 dark:border-gray-800 dark:bg-amber-950/5">
              <p className="text-xs font-semibold tracking-wide text-amber-600 uppercase dark:text-amber-400">
                Total Idle Time
              </p>
              <p className="mt-1 font-mono text-2xl font-bold">
                {formatDuration(
                  totalIdleMs +
                    (status === "paused" && idleStart
                      ? Date.now() - new Date(idleStart).getTime()
                      : 0),
                )}
              </p>

              {idleSessions.length > 0 && (
                <div className="mt-4 max-h-32 space-y-1.5 overflow-y-auto">
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Idle intervals:
                  </p>
                  {idleSessions.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between rounded border border-gray-100 bg-white p-1.5 text-xs dark:border-gray-800 dark:bg-gray-900"
                    >
                      <span>Break #{index + 1}</span>
                      <div className="flex gap-1.5">
                        <MyClock date={item.start} /> to{" "}
                        <MyClock date={item.end} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Historical logs Section */}
      <div className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Session History
            </h3>
            <p className="text-xs text-gray-500">
              Every completed work cycle is filed cleanly below.
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs font-semibold text-red-600 transition-colors hover:text-red-700 hover:underline dark:text-red-400"
            >
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
            <p className="text-sm text-gray-400">
              No session logs saved yet. Finish a tracking session to view
              records.
            </p>
          </div>
        ) : (
          <div className="max-h-[450px] space-y-4 overflow-y-auto pr-2">
            {history.map((record) => (
              <div
                key={record.id}
                className="rounded-xl border border-gray-200 bg-gray-50/30 p-5 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/10"
              >
                <div className="mb-3 flex flex-col justify-between gap-2 border-b border-gray-100 pb-3 sm:flex-row sm:items-center dark:border-gray-800">
                  <div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {record.date}
                    </span>
                    <span className="ml-2 font-mono text-xs text-gray-400">
                      ID: {record.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Work: {formatDuration(record.totalWorkMs)}
                    </span>
                    {record.addedMs && record.addedMs > 0 ? (
                      <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        (Incl. +{formatDuration(record.addedMs)} manually added)
                      </span>
                    ) : null}
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      Idle: {formatDuration(record.totalIdleMs)}
                    </span>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs font-semibold text-gray-400 uppercase">
                      Work Intervals ({record.workSessions.length})
                    </p>
                    <div className="space-y-1">
                      {record.workSessions.map((session, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between rounded border border-gray-100/50 bg-white p-1.5 text-xs dark:border-gray-800/50 dark:bg-gray-900"
                        >
                          <span className="text-gray-500">
                            Sprint {idx + 1}
                          </span>
                          <div className="flex gap-1">
                            <MyClock date={session.start} />{" "}
                            <span className="text-gray-400">to</span>{" "}
                            <MyClock date={session.end} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold text-gray-400 uppercase">
                      Idle Breaks ({record.idleSessions.length})
                    </p>
                    {record.idleSessions.length === 0 ? (
                      <p className="p-1.5 text-xs text-gray-400 italic">
                        No breaks taken.
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {record.idleSessions.map((session, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between rounded border border-gray-100/50 bg-white p-1.5 text-xs dark:border-gray-800/50 dark:bg-gray-900"
                          >
                            <span className="text-gray-500">
                              Break {idx + 1}
                            </span>
                            <div className="flex gap-1">
                              <MyClock date={session.start} />{" "}
                              <span className="text-gray-400">to</span>{" "}
                              <MyClock date={session.end} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeRunnerV02;
