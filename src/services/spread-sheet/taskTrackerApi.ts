import { IWorkEntryType } from "@/types/taskTracker";


export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbybugEQSIZn2Tme_wsBXsbHcdacFixHDmBnmiZYCOQSYRohhAzXLUMirwx95VnfsvkScQ/exec";

/**
 * Fetch all work entries from Google Sheets.
 *
 * Uses JSONP because Google Apps Script Web Apps
 * do not reliably expose CORS headers for browser fetch.
 */
export function getWorkEntries(): Promise<IWorkEntryType[]> {
  return new Promise((resolve, reject) => {
    const callbackName = `taskTrackerCallback_${Date.now()}`;

    const script = document.createElement("script");

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Request timed out."));
    }, 15000);

    const cleanup = () => {
      window.clearTimeout(timeout);
      delete (window as any)[callbackName];
      script.remove();
    };

    (window as any)[callbackName] = (response: {
      success: boolean;
      data?: IWorkEntryType[];
      message?: string;
    }) => {
      cleanup();

      if (!response.success) {
        reject(new Error(response.message || "Failed to load work entries."));
        return;
      }

      resolve(response.data || []);
    };

    script.src = `${GOOGLE_SCRIPT_URL}?action=getEntries&callback=${callbackName}`;

    script.onerror = () => {
      cleanup();
      reject(new Error("Could not connect to Google Apps Script."));
    };

    document.body.appendChild(script);
  });
}