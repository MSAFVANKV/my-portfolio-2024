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

    const cleanup = () => {
      window.clearTimeout(timeout);

      delete (window as unknown as Record<string, unknown>)[callbackName];

      script.remove();
    };

    const timeout = window.setTimeout(() => {
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

  // IMPORTANT:
  // Apps Script returns:
  //
  // {
  //   success: true,
  //   data: {
  //     title: "...",
  //     fields: [...]
  //   }
  // }
  //
  // So the schema is inside response.data.
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
 *
 * We intentionally use no-cors here because
 * Apps Script POST responses cannot be reliably
 * read by the browser in this setup.
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
 * DELETE
 * ============================
 */
export async function deleteWorkEntry(
  googleScriptUrl: string,
  row: number,
): Promise<void> {
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
