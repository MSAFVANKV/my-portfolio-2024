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
   */
  system?: boolean;

  /**
   * Show this field in the table.
   */
  table?: boolean;

  /**
   * Show this field in the create/edit form.
   */
  form?: boolean;
}

export interface ITaskTrackerSchema {
  name?: string;
  sheetName?: string;
  headerRow?: number;
  dataStartRow?: number;
  fields: ITaskTrackerField[];
}

export interface IWorkEntryType {
  /**
   * Actual Google Sheet row number.
   */
  row: number;

  /**
   * Dynamic values returned from Google Apps Script.
   */
  values: Record<string, unknown>;

  submittedAt?: string;
}