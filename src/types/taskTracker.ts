// src/types/taskTracker.ts

export type DynamicFieldType =
  | "text"
  | "date"
  | "datetime"
  | "url"
  | "number"
  | "textarea"
  | "select";

export interface IFieldOption {
  label: string;
  value: string;
}

export interface ITaskTrackerField {
  key: string;
  label: string;
  type: DynamicFieldType;

  required?: boolean;

  placeholder?: string;

  defaultValue?: string | number;

  options?: IFieldOption[];

  min?: number;
  max?: number;
  step?: number;

  /**
   * System fields are not shown in the create/edit form.
   * Example: submittedAt
   */
  system?: boolean;

  /**
   * Show this field in the table.
   */
  table?: boolean;
}

export interface ITaskTrackerSchema {
  name?: string;
  sheetName?: string;
  headerRow?: number;
  dataStartRow?: number;
  fields: ITaskTrackerField[];
}

export interface IWorkEntryType {
  row?: number;

  /**
   * Dynamic values returned from Google Apps Script.
   *
   * Example:
   * {
   *   date: "2026-11-01",
   *   project: "Travalet",
   *   task: "Fixed login",
   *   customer: "ABC"
   * }
   */
  values: Record<string, unknown>;

  submittedAt?: string;
}