import DailyWorkTrackerForm from "@/components/daily-work-tracker/DailyWorkTrackerCreateForm";
import WorkEntriesTable from "@/components/daily-work-tracker/WorkEntriesTable";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "@/hooks/use-toast";

import { ITaskTrackerSchema, IWorkEntryType } from "@/types/taskTracker";

import { useEffect, useState } from "react";

import { getScriptSchema } from "@/services/spread-sheet/taskTrackerApi";

import { DEFAULT_TASK_TRACKER_SCHEMA } from "@/services/spread-sheet/taskTrackerSchema";

type Props = {};

const DEFAULT_GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbybugEQSIZn2Tme_wsBXsbHcdacFixHDmBnmiZYCOQSYRohhAzXLUMirwx95VnfsvkScQ/exec";

const DEFAULT_GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1OL_mkpZZnABfdvoVtVNX8jtdWcTnTq4xIdZGUKY4L4I/edit?pli=1&gid=0#gid=0";

function DailyWorkTrackerPage({}: Props) {
  const [editData, setEditData] = useState<IWorkEntryType | null>(null);

  const [googleScriptUrl, setGoogleScriptUrl] = useState(
    DEFAULT_GOOGLE_SCRIPT_URL,
  );

  const [googleSheetUrl, setGoogleSheetUrl] = useState(
    DEFAULT_GOOGLE_SHEET_URL,
  );

  /*
   * Keep URL inputs empty.
   */

  const [newGoogleScriptUrl, setNewGoogleScriptUrl] = useState("");

  const [newGoogleSheetUrl, setNewGoogleSheetUrl] = useState("");

  /*
   * Dynamic schema.
   */

  const [schema, setSchema] = useState<ITaskTrackerSchema>(
    DEFAULT_TASK_TRACKER_SCHEMA,
  );

  const [schemaLoading, setSchemaLoading] = useState(true);

  /*
   * ============================
   * LOAD GOOGLE CONFIG
   * ============================
   */

  useEffect(() => {
    async function initialize() {
      const savedScriptUrl = localStorage.getItem("googleScriptUrl");

      const savedSheetUrl = localStorage.getItem("googleSheetUrl");

      const activeScriptUrl = savedScriptUrl || DEFAULT_GOOGLE_SCRIPT_URL;

      const activeSheetUrl = savedSheetUrl || DEFAULT_GOOGLE_SHEET_URL;

      setGoogleScriptUrl(activeScriptUrl);

      setGoogleSheetUrl(activeSheetUrl);

      /*
       * Never expose saved URLs in inputs.
       */

      setNewGoogleScriptUrl("");
      setNewGoogleSheetUrl("");

      /*
       * ============================
       * LOAD DYNAMIC SCHEMA
       * ============================
       */

      setSchemaLoading(true);

      try {
        const remoteSchema = await getScriptSchema(activeScriptUrl);
        // console.log(remoteSchema, "remoteSchema");

        setSchema(remoteSchema);
      } catch (error) {
        console.error("Schema loading failed:", error);

        /*
         * If the default script is being used,
         * keep the default schema silently.
         *
         * If a custom script is configured,
         * warn the user.
         */

        setSchema(DEFAULT_TASK_TRACKER_SCHEMA);

        if (savedScriptUrl) {
          toast({
            title: "Dynamic schema unavailable",
            variant: "destructive",
            description:
              "The configured Google Script does not support the dynamic schema API. The default fields are being used.",
          });
        }
      } finally {
        setSchemaLoading(false);
      }
    }

    initialize();
  }, []);

  /*
   * ============================
   * EDIT DATA
   * ============================
   */

  const handleEditDataChange = (data: IWorkEntryType | null) => {
    setEditData(data);
  };

  const isEditing = editData !== null;

  /*
   * ============================
   * SAVE GOOGLE URLS
   * ============================
   */

  const handleSetGoogleUrls = async () => {
    const scriptUrl = newGoogleScriptUrl.trim();

    const sheetUrl = newGoogleSheetUrl.trim();

    /*
     * Script URL
     */

    if (!scriptUrl) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please enter a Google Apps Script URL.",
      });

      return;
    }

    try {
      const parsedUrl = new URL(scriptUrl);

      if (!parsedUrl.hostname.includes("script.google.com")) {
        throw new Error();
      }
    } catch {
      toast({
        title: "Invalid Google Script URL",
        variant: "destructive",
        description: "Please enter a valid Google Apps Script Web App URL.",
      });

      return;
    }

    /*
     * Sheet URL
     */

    if (!sheetUrl) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please enter a Google Sheet URL.",
      });

      return;
    }

    try {
      const parsedUrl = new URL(sheetUrl);

      if (!parsedUrl.hostname.includes("docs.google.com")) {
        throw new Error();
      }
    } catch {
      toast({
        title: "Invalid Google Sheet URL",
        variant: "destructive",
        description: "Please enter a valid Google Sheets URL.",
      });

      return;
    }

    /*
     * ============================
     * TEST NEW SCRIPT SCHEMA
     * ============================
     */

    setSchemaLoading(true);

    try {
      const remoteSchema = await getScriptSchema(scriptUrl);

      /*
       * Save only after schema works.
       */

      localStorage.setItem("googleScriptUrl", scriptUrl);

      localStorage.setItem("googleSheetUrl", sheetUrl);

      setGoogleScriptUrl(scriptUrl);

      setGoogleSheetUrl(sheetUrl);

      setSchema(remoteSchema);

      /*
       * Keep URL fields empty.
       */

      setNewGoogleScriptUrl("");
      setNewGoogleSheetUrl("");

      setEditData(null);

      toast({
        title: "Google settings updated",
        description: `Loaded ${remoteSchema.fields.length} fields from the new Google Script.`,
      });
    } catch (error) {
      console.error(error);

      toast({
        title: "Could not load Script schema",
        variant: "destructive",
        description:
          "The Google Script must support action=getSchema. Your current settings were not changed.",
      });
    } finally {
      setSchemaLoading(false);
    }
  };

  /*
   * ============================
   * RESET
   * ============================
   */

  const handleResetGoogleUrls = async () => {
    localStorage.removeItem("googleScriptUrl");

    localStorage.removeItem("googleSheetUrl");

    setGoogleScriptUrl(DEFAULT_GOOGLE_SCRIPT_URL);

    setGoogleSheetUrl(DEFAULT_GOOGLE_SHEET_URL);

    setNewGoogleScriptUrl("");
    setNewGoogleSheetUrl("");

    setSchema(DEFAULT_TASK_TRACKER_SCHEMA);

    setEditData(null);

    /*
     * Try loading the default schema
     * from the default Script.
     */

    try {
      const defaultSchema = await getScriptSchema(DEFAULT_GOOGLE_SCRIPT_URL);

      setSchema(defaultSchema);
    } catch {
      /*
       * Keep local fallback schema.
       */
    }

    toast({
      title: "Google settings reset",
      description:
        "The default Google Script and default fields are now active.",
    });
  };

  return (
    <div>
      {/* ============================
          GOOGLE SETTINGS
          ============================ */}

      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Google Settings</h1>

        <p className="text-sm text-slate-500">
          Configure the Google Apps Script and Google Sheet used by your Daily
          Work Tracker.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="google-script-url">Google Script URL</Label>

            <Input
              id="google-script-url"
              type="url"
              placeholder="Enter Google Apps Script URL"
              value={newGoogleScriptUrl}
              onChange={(e) => setNewGoogleScriptUrl(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="google-sheet-url">Google Sheet URL</Label>

            <Input
              id="google-sheet-url"
              type="url"
              placeholder="Enter Google Sheet URL"
              value={newGoogleSheetUrl}
              onChange={(e) => setNewGoogleSheetUrl(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="mt-3 flex gap-3">
          <Button
            type="button"
            onClick={handleSetGoogleUrls}
            disabled={schemaLoading}
          >
            {schemaLoading ? "Loading..." : "Save Google Settings"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleResetGoogleUrls}
          >
            Reset
          </Button>
        </div>

        {schemaLoading && (
          <p className="mt-2 text-xs text-slate-500">
            Loading fields from Google Script...
          </p>
        )}

        {!schemaLoading && (
          <p className="mt-2 text-xs text-slate-500">
            Active schema:{" "}
            <strong>
              {schema.title || schema.sheetName || schema.name || "Unknown"}
            </strong>
            · {schema.fields.filter((field) => !field.system).length} form
            fields
          </p>
        )}
      </div>

      {/* ============================
          WORK FORM
          ============================ */}

      {!schemaLoading && (
        <DailyWorkTrackerForm
          data={editData}
          isEdit={isEditing}
          googleScriptUrl={googleScriptUrl}
          schema={schema}
          onSuccess={() => {
            setEditData(null);
          }}
        />
      )}

      {/* ============================
          WORK TABLE
          ============================ */}

      {!schemaLoading && (
        <WorkEntriesTable
          setEditData={handleEditDataChange}
          isEdit={isEditing}
          googleScriptUrl={googleScriptUrl}
          googleSheetUrl={googleSheetUrl}
          schema={schema}
        />
      )}
    </div>
  );
}

export default DailyWorkTrackerPage;
