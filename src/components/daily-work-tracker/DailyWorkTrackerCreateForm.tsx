"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  ITaskTrackerField,
  ITaskTrackerSchema,
  IWorkEntryType,
} from "@/types/taskTracker";

import { saveWorkEntry } from "@/services/spread-sheet/taskTrackerApi";

type FormValues = Record<string, unknown>;

type DailyWorkTrackerFormProps = {
  isEdit?: boolean;
  data?: IWorkEntryType | null;
  onSuccess?: () => void;

  googleScriptUrl: string;
  schema: ITaskTrackerSchema;
};

function getToday() {
  const date = new Date();

  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}

function getDefaultValue(field: ITaskTrackerField): unknown {
  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }

  if (field.type === "date") {
    return getToday();
  }

  if (field.type === "number") {
    return 0;
  }

  return "";
}

function createInitialValues(schema: ITaskTrackerSchema): FormValues {
  const values: FormValues = {};

  schema.fields
    .filter((field) => !field.system)
    .forEach((field) => {
      values[field.key] = getDefaultValue(field);
    });

  return values;
}

function getInputValue(value: unknown): string | number {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  return String(value);
}

export default function DailyWorkTrackerForm({
  isEdit = false,
  data = null,
  onSuccess,
  googleScriptUrl,
  schema,
}: DailyWorkTrackerFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");

  const initialValues = useMemo(() => createInitialValues(schema), [schema]);

  const form = useForm<FormValues>({
    mode: "onChange",
    defaultValues: initialValues,
  });

  /*
   * ============================
   * LOAD EDIT DATA
   * ============================
   */

  useEffect(() => {
    if (isEdit && data) {
      form.reset({
        ...initialValues,
        ...data.values,
      });
    } else {
      form.reset(initialValues);
    }

    setMessage("");
  }, [isEdit, data, schema, form, initialValues]);

  /*
   * ============================
   * VALIDATION
   * ============================
   */

  function validateValues(values: FormValues) {
    let valid = true;

    schema.fields
      .filter((field) => !field.system)
      .forEach((field) => {
        const value = values[field.key];

        const isEmpty =
          value === undefined || value === null || String(value).trim() === "";

        if (field.required && isEmpty) {
          form.setError(field.key, {
            type: "required",
            message: `${field.label} is required`,
          });

          valid = false;
          return;
        }

        form.clearErrors(field.key);

        if (field.type === "number" && !isEmpty) {
          const numberValue = Number(value);

          if (Number.isNaN(numberValue)) {
            form.setError(field.key, {
              type: "validate",
              message: `${field.label} must be a number`,
            });

            valid = false;
            return;
          }

          if (field.min !== undefined && numberValue < field.min) {
            form.setError(field.key, {
              type: "validate",
              message: `${field.label} must be at least ${field.min}`,
            });

            valid = false;
            return;
          }

          if (field.max !== undefined && numberValue > field.max) {
            form.setError(field.key, {
              type: "validate",
              message: `${field.label} cannot exceed ${field.max}`,
            });

            valid = false;
            return;
          }
        }
      });

    return valid;
  }

  /*
   * ============================
   * SUBMIT
   * ============================
   */

  async function onSubmit(values: FormValues) {
    setMessage("");

    const valid = validateValues(values);

    if (!valid) {
      setMessage("Please complete the required fields.");
      return;
    }

    if (!googleScriptUrl) {
      setMessage("Google Apps Script URL is not configured.");
      return;
    }

    if (isEdit && !data?.row) {
      setMessage("Could not identify the work entry to update.");
      return;
    }

    setSubmitting(true);

    try {
      const payload: FormValues = {
        ...values,
      };

      /*
       * Convert number fields correctly.
       */

      schema.fields.forEach((field) => {
        if (field.type === "number" && payload[field.key] !== "") {
          payload[field.key] = Number(payload[field.key]);
        }
      });

      await saveWorkEntry(
        googleScriptUrl,
        payload,
        isEdit
          ? {
              row: data?.row,
            }
          : undefined,
      );

      setMessage(
        isEdit
          ? "Work entry updated successfully."
          : "Work entry submitted successfully.",
      );

      // if (!isEdit) {
      //   form.reset({
      //     ...initialValues,

      //     /*
      //      * Preserve date when possible.
      //      */
      //     ...(values.date
      //       ? {
      //           date: values.date,
      //         }
      //       : {}),
      //   });
      // }
      if (!isEdit) {
        form.reset(initialValues);
      }

      onSuccess?.();
    } catch (error) {
      console.error(error);

      setMessage(
        isEdit
          ? "Could not update the work entry."
          : "Could not submit the work entry.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * ============================
   * RESET
   * ============================
   */

  function handleClear() {
    if (isEdit && data) {
      form.reset({
        ...initialValues,
        ...data.values,
      });
    } else {
      form.reset(initialValues);
    }

    setMessage("");
  }

  /*
   * ============================
   * FIELD RENDERER
   * ============================
   */

  function renderField(field: ITaskTrackerField) {
    const error = form.formState.errors[field.key];

    const inputClass =
      "mt-1.5 w-full h-12 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

    /*
     * TEXTAREA
     */

    if (field.type === "textarea") {
      return (
        <div key={field.key} className="sm:col-span-2">
          <Label htmlFor={field.key}>
            {field.label}
            {field.required ? " *" : ""}
          </Label>

          <textarea
            id={field.key}
            rows={4}
            placeholder={field.placeholder}
            className={`${inputClass} h-auto resize-none`}
            {...form.register(field.key)}
          />

          {error && (
            <p className="mt-1 text-xs text-red-500">{String(error.message)}</p>
          )}
        </div>
      );
    }

    /*
     * SELECT
     */

    if (field.type === "select") {
      return (
        <div key={field.key}>
          <Label htmlFor={field.key}>
            {field.label}
            {field.required ? " *" : ""}
          </Label>

          <select
            id={field.key}
            className={inputClass}
            {...form.register(field.key)}
          >
            {!field.required && <option value="">Select {field.label}</option>}

            {(field.options || []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {error && (
            <p className="mt-1 text-xs text-red-500">{String(error.message)}</p>
          )}
        </div>
      );
    }

    /*
     * NORMAL INPUT
     */

    return (
      <div key={field.key}>
        <Label htmlFor={field.key}>
          {field.label}
          {field.required ? " *" : ""}
        </Label>

        <Input
          id={field.key}
          type={field.type === "datetime" ? "datetime-local" : field.type}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          step={field.step}
          className={inputClass}
          {...form.register(field.key)}
        />

        {error && (
          <p className="mt-1 text-xs text-red-500">{String(error.message)}</p>
        )}
      </div>
    );
  }

  const formFields = schema.fields.filter((field) => !field.system);

  return (
    <main className="min-h-screen">
      <div className="mx-auto">
        <header className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
            📋
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {schema.name || "Daily Work Tracker"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {isEdit ? "Update your work entry." : "Record your daily work."}
          </p>
        </header>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 px-5 py-4 sm:px-8">
            <h2 className="font-semibold text-slate-900">
              {isEdit ? "Edit work entry" : "Work entry"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Fields are loaded dynamically from your configured Google Script.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-3 sm:p-8">
            {formFields.map(renderField)}
          </div>

          {message && (
            <div className="mx-5 mb-5 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 sm:mx-8">
              {message}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <button
              type="button"
              onClick={handleClear}
              disabled={submitting}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {isEdit ? "Reset changes" : "Clear form"}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? isEdit
                  ? "Updating..."
                  : "Submitting..."
                : isEdit
                  ? "Update work entry"
                  : "Submit work entry"}

              {!submitting && <span aria-hidden="true">→</span>}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Fields are generated from the active Google Script schema.
        </p>
      </div>
    </main>
  );
}
