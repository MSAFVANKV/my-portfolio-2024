// store/slices/googleSheetSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITaskTrackerSchema, IWorkEntryType } from "@/types/taskTracker";
import { getWorkEntries } from "@/services/spread-sheet/taskTrackerApi";
import type { RootState } from "../store";

const DEFAULT_GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbybugEQSIZn2Tme_wsBXsbHcdacFixHDmBnmiZYCOQSYRohhAzXLUMirwx95VnfsvkScQ/exec";

/**
 * ============================
 * NORMALIZE ENTRY HELPER
 * ============================
 */
export function normalizeEntry(
  rawEntry: unknown,
  schema?: ITaskTrackerSchema | null,
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

  if (
    raw.values &&
    typeof raw.values === "object" &&
    !Array.isArray(raw.values)
  ) {
    values = {
      ...(raw.values as Record<string, unknown>),
    };
  } else {
    if (schema?.fields && Array.isArray(schema.fields)) {
      schema.fields.forEach((field) => {
        if (field.key in raw) {
          values[field.key] = raw[field.key];
        }
      });
    } else {
      Object.keys(raw).forEach((key) => {
        if (key !== "row") {
          values[key] = raw[key];
        }
      });
    }
  }

  if (schema?.fields && Array.isArray(schema.fields)) {
    schema.fields.forEach((field) => {
      if (!(field.key in values)) {
        values[field.key] = "";
      }
    });
  }

  return {
    row: rowNumber,
    values,
    submittedAt:
      (raw.submittedAt as string) ||
      (values.submittedAt as string) ||
      undefined,
  };
}

/**
 * ============================
 * TYPES & ARGS
 * ============================
 */
export interface FetchWorkEntriesParams {
  googleScriptUrl?: string;
  schema?: ITaskTrackerSchema | null;
}

export type FetchWorkEntriesArgs =
  | string
  | FetchWorkEntriesParams
  | void
  | undefined;

export interface IGoogleSheetState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: string | null;
  data: IWorkEntryType[] | null;
  entries: IWorkEntryType[];
}

const initialState: IGoogleSheetState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
  data: null,
  entries: [],
};

/**
 * ========================================================
 * ASYNC THUNK: GET TABLE DATA
 * Easily callable anywhere:
 * - dispatch(fetchWorkEntries({ googleScriptUrl, schema }))
 * - dispatch(fetchWorkEntries(googleScriptUrl))
 * - dispatch(fetchWorkEntries()) -> uses localStorage / default
 * ========================================================
 */
export const fetchWorkEntries = createAsyncThunk<
  IWorkEntryType[],
  FetchWorkEntriesArgs,
  { rejectValue: string }
>("googleSheet/fetchWorkEntries", async (args, { rejectWithValue }) => {
  try {
    let scriptUrl = "";
    let schema: ITaskTrackerSchema | null | undefined = null;

    if (typeof args === "string") {
      scriptUrl = args;
    } else if (args && typeof args === "object") {
      scriptUrl = args.googleScriptUrl || "";
      schema = args.schema;
    }

    if (!scriptUrl && typeof window !== "undefined") {
      scriptUrl =
        localStorage.getItem("googleScriptUrl") || DEFAULT_GOOGLE_SCRIPT_URL;
    }

    if (!scriptUrl?.trim()) {
      return rejectWithValue("Google Apps Script URL is not configured.");
    }

    const rawData = await getWorkEntries(scriptUrl);

    if (!Array.isArray(rawData)) {
      return rejectWithValue(
        "Google Script returned invalid work entries data.",
      );
    }

    const normalizedEntries = rawData
      .map((entry) => normalizeEntry(entry, schema))
      .filter((entry): entry is IWorkEntryType => entry !== null);

    if (rawData.length > 0 && normalizedEntries.length === 0) {
      return rejectWithValue(
        "Google Script returned work entries, but their data format is invalid.",
      );
    }

    return normalizedEntries;
  } catch (error) {
    console.error("Failed to load work entries:", error);
    const message =
      error instanceof Error ? error.message : "Failed to load work entries.";
    return rejectWithValue(message);
  }
});

// Convenient aliases
export const getTableData = fetchWorkEntries;
export const getWorkEntriesThunk = fetchWorkEntries;

/**
 * ============================
 * SLICE
 * ============================
 */
export const googleSheetSlice = createSlice({
  name: "googleSheet",
  initialState,
  reducers: {
    clearGoogleSheetError: (state) => {
      state.isError = false;
      state.error = null;
    },
    resetGoogleSheetState: () => initialState,
    setEntries: (state, action: PayloadAction<IWorkEntryType[]>) => {
      state.data = action.payload;
      state.entries = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkEntries.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchWorkEntries.fulfilled,
        (state, action: PayloadAction<IWorkEntryType[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.error = null;
          state.data = action.payload;
          state.entries = action.payload;
        },
      )
      .addCase(fetchWorkEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.error = action.payload || "Failed to load work entries.";
        state.data = [];
        state.entries = [];
      });
  },
});

export const { clearGoogleSheetError, resetGoogleSheetState, setEntries } =
  googleSheetSlice.actions;

export default googleSheetSlice.reducer;

/**
 * ============================
 * SELECTORS
 * ============================
 */
export const selectGoogleSheet = (state: RootState) => state.googleSheet;
export const selectGoogleSheetData = (state: RootState) =>
  state.googleSheet.data;
export const selectGoogleSheetEntries = (state: RootState) =>
  state.googleSheet.entries;
export const selectGoogleSheetLoading = (state: RootState) =>
  state.googleSheet.isLoading;
export const selectGoogleSheetError = (state: RootState) =>
  state.googleSheet.error;
