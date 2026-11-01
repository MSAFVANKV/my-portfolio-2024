import { ITaskTrackerSchema, IWorkEntryType } from "@/types/taskTracker";

type GetSchemaResponse = {
  success: boolean;
  data?: ITaskTrackerSchema;
  message?: string;
  error?: string;
};

type GetEntriesResponse = {
  success: boolean;
  data?: IWorkEntryType[];
  schema?: ITaskTrackerSchema;
  message?: string;
  error?: string;
};

type GenericResponse = {
  success: boolean;
  message?: string;
  error?: string;
  deleted?: number;
};

function createJsonpRequest<T>(
  googleScriptUrl: string,
  params: Record<string, string>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = `taskTrackerCallback_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;

    const script = document.createElement("script");

    const query = new URLSearchParams({
      ...params,
      callback: callbackName,
    });

    let timeout: number;

    const cleanup = () => {
      window.clearTimeout(timeout);

      delete (window as unknown as Record<string, unknown>)[callbackName];

      script.remove();
    };

    timeout = window.setTimeout(() => {
      cleanup();

      reject(
        new Error(
          "Request timed out while communicating with Google Apps Script.",
        ),
      );
    }, 15000);

    (window as unknown as Record<string, (response: T) => void>)[callbackName] =
      (response: T) => {
        cleanup();
        resolve(response);
      };

    script.src = `${googleScriptUrl}?${query.toString()}`;

    script.onerror = () => {
      cleanup();

      reject(new Error("Could not connect to Google Apps Script."));
    };

    document.body.appendChild(script);
  });
}

/**
 * ============================
 * GET DYNAMIC SCHEMA
 * ============================
 */

export async function getScriptSchema(
  googleScriptUrl: string,
): Promise<ITaskTrackerSchema> {
  const response = await createJsonpRequest<GetSchemaResponse>(
    googleScriptUrl,
    {
      action: "getSchema",
    },
  );

  if (!response.success) {
    throw new Error(
      response.message ||
        response.error ||
        "Failed to load Google Script schema.",
    );
  }

  if (
    !response.data ||
    !Array.isArray(response.data.fields) ||
    response.data.fields.length === 0
  ) {
    throw new Error("Google Script returned an empty schema.");
  }

  return response.data;
}

/**
 * ============================
 * GET WORK ENTRIES
 * ============================
 */

export async function getWorkEntries(
  googleScriptUrl: string,
): Promise<IWorkEntryType[]> {
  const response = await createJsonpRequest<GetEntriesResponse>(
    googleScriptUrl,
    {
      action: "getEntries",
    },
  );

  if (!response.success) {
    throw new Error(
      response.message || response.error || "Failed to load work entries.",
    );
  }

  return response.data || [];
}

/**
 * ============================
 * CREATE / UPDATE
 * ============================
 */

export async function saveWorkEntry(
  googleScriptUrl: string,
  values: Record<string, unknown>,
  options?: {
    row?: number;
  },
): Promise<void> {
  const payload = {
    action: options?.row !== undefined ? "update" : "create",

    ...(options?.row !== undefined && {
      row: options.row,
    }),

    values,
  };

  await fetch(googleScriptUrl, {
    method: "POST",
    mode: "no-cors",

    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },

    body: JSON.stringify(payload),
  });
}

/**
 * ============================
 * SINGLE DELETE
 * ============================
 */

export async function deleteWorkEntry(
  googleScriptUrl: string,
  row: number,
): Promise<void> {
  if (!Number.isInteger(row) || row <= 0) {
    throw new Error("Invalid row number.");
  }

  const response = await createJsonpRequest<GenericResponse>(googleScriptUrl, {
    action: "delete",
    row: String(row),
  });

  if (!response.success) {
    throw new Error(
      response.message || response.error || "Failed to delete work entry.",
    );
  }
}

/**
 * ============================
 * MULTIPLE DELETE
 * ============================
 */

export async function deleteMultipleWorkEntries(
  googleScriptUrl: string,
  rows: number[],
): Promise<number> {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No rows selected.");
  }

  const validRows = rows.filter((row) => Number.isInteger(row) && row > 0);

  if (validRows.length === 0) {
    throw new Error("No valid rows selected.");
  }

  const uniqueRows = [...new Set(validRows)];

  const response = await createJsonpRequest<GenericResponse>(googleScriptUrl, {
    action: "deleteMultiple",
    rows: JSON.stringify(uniqueRows),
  });

  if (!response.success) {
    throw new Error(
      response.message ||
        response.error ||
        "Failed to delete selected work entries.",
    );
  }

  return response.deleted ?? uniqueRows.length;
}
