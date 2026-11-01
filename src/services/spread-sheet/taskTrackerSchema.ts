import {
  ITaskTrackerSchema,
} from "@/types/taskTracker";

export const DEFAULT_TASK_TRACKER_SCHEMA: ITaskTrackerSchema = {
  name: "Task Tracker",
  sheetName: "Task Tracker",
  headerRow: 7,
  dataStartRow: 8,

  fields: [
    {
      key: "date",
      label: "Work Date",
      type: "date",
      required: true,
      table: true,
    },

    {
      key: "project",
      label: "Project",
      type: "text",
      required: true,
      placeholder: "e.g. Travalet Web UI",
      table: true,
    },

    {
      key: "task",
      label: "Task Title",
      type: "text",
      required: true,
      placeholder: "e.g. Fixed package policy validation",
      table: true,
    },

    {
      key: "ui",
      label: "UI",
      type: "text",
      required: true,
      placeholder: "e.g. Admin Dashboard",
      table: true,
    },

    {
      key: "pageName",
      label: "Page Name",
      type: "text",
      required: true,
      placeholder: "e.g. Dashboard",
      table: true,
    },

    {
      key: "pageUrl",
      label: "Page URL",
      type: "url",
      required: true,
      placeholder: "https://example.com/dashboard",
      table: true,
    },

    {
      key: "category",
      label: "Work Category",
      type: "select",
      defaultValue: "Development",
      table: true,

      options: [
        {
          label: "Development",
          value: "Development",
        },
        {
          label: "Bug Fix",
          value: "Bug Fix",
        },
        {
          label: "Testing",
          value: "Testing",
        },
        {
          label: "Code Review",
          value: "Code Review",
        },
        {
          label: "Learning",
          value: "Learning",
        },
        {
          label: "Meeting",
          value: "Meeting",
        },
        {
          label: "Documentation",
          value: "Documentation",
        },
        {
          label: "Other",
          value: "Other",
        },
      ],
    },

    {
      key: "priority",
      label: "Priority",
      type: "select",
      defaultValue: "Medium",
      table: true,

      options: [
        {
          label: "Low",
          value: "Low",
        },
        {
          label: "Medium",
          value: "Medium",
        },
        {
          label: "High",
          value: "High",
        },
        {
          label: "Urgent",
          value: "Urgent",
        },
      ],
    },

    {
      key: "status",
      label: "Status",
      type: "select",
      defaultValue: "In Progress",
      table: true,

      options: [
        {
          label: "Not Started",
          value: "Not Started",
        },
        {
          label: "In Progress",
          value: "In Progress",
        },
        {
          label: "Completed",
          value: "Completed",
        },
        {
          label: "Blocked",
          value: "Blocked",
        },
      ],
    },

    {
      key: "hours",
      label: "Hours Spent",
      type: "number",
      required: true,
      defaultValue: 1,
      min: 0.25,
      max: 24,
      step: 0.25,
      table: true,
    },

    {
      key: "notes",
      label: "Work Details / Notes",
      type: "textarea",
      placeholder:
        "What did you complete? Any blockers or follow-up tasks?",
      table: true,
    },

    {
      key: "submittedAt",
      label: "Submitted At",
      type: "datetime",
      system: true,
      table: true,
    },
  ],
};