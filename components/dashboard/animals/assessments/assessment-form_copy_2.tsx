"use client";

import React, { useState, useMemo, FC } from "react";
import { Plus, X } from "lucide-react"; // Import icons from lucide-react
import { FormattedTemplates } from "@/app/lib/data/animals/animal-assessment.data";

// --- TYPESCRIPT DEFINITIONS ---
// These types define the shape of our data, ensuring type safety.

// Represents a single field within a template (the configuration)
type TemplateFieldConfig = {
  name: string;
  options?: readonly string[];
  placeholder?: string;
  redFlags?: readonly string[];
};

type TemplateKey =
  | "INTAKE_BEHAVIORAL"
  | "INTAKE_MEDICAL"
  | "DAILY_MONITORING";

// Represents a full assessment template (e.g., "Intake Behavioral")
type AssessmentTemplate = {
  fields: readonly TemplateFieldConfig[];
  suggestedTasks: Record<string, { text: string; team: string }>;
};

// Represents the state of a single row in the form, including user input
type FormFieldState = {
  id: string;
  name: string; // For custom fields, this is editable
  value: string;
  notes: string;
  isPredefined: boolean;
  // Configuration from the template is copied here for easy access
  options?: readonly string[];
  placeholder?: string;
  redFlags?: readonly string[];
};

// Represents a suggested task generated from a red flag
type SuggestedTask = {
  key: string;
  text: string;
  team: string;
};

// --- MOCK DATA (This would come from a database/API in a real app) ---
const assessmentTemplates: Record<TemplateKey, AssessmentTemplate> = {
  INTAKE_BEHAVIORAL: {
    fields: [
      {
        name: "Kennel Presence",
        options: ["Quiet", "Anxious", "Barking", "Alert"],
        redFlags: ["Anxious", "Barking"],
      },
      {
        name: "Leash Manners",
        options: [
          "Pulls Heavily",
          "Pulls Moderately",
          "Loose Leash",
          "Walks Politely",
        ],
        redFlags: ["Pulls Heavily"],
      },
      {
        name: "Handling Sensitivity (Paws)",
        options: ["Tolerant", "Hesitant", "Pulls Away", "Mouths Hand"],
        redFlags: ["Pulls Away", "Mouths Hand"],
      },
      {
        name: "Food Guarding (High Value)",
        options: ["None", "Stiffens", "Growls", "Snaps"],
        redFlags: ["Stiffens", "Growls", "Snaps"],
      },
      {
        name: "Toy Possessiveness",
        options: ["Shares Easily", "Reluctant to Drop", "Guards Toy"],
        redFlags: ["Guards Toy"],
      },
    ],
    suggestedTasks: {
      Anxious: {
        text: "Behavioral consult for kennel anxiety.",
        team: "Behavioral",
      },
      Barking: {
        text: "Behavioral consult for excessive barking.",
        team: "Behavioral",
      },
      "Pulls Heavily": {
        text: "Enroll in loose-leash walking program.",
        team: "Training",
      },
      "Pulls Away": {
        text: "Start desensitization for handling.",
        team: "Behavioral",
      },
      "Mouths Hand": { text: "Assess bite inhibition.", team: "Behavioral" },
      Stiffens: {
        text: "Monitor closely during feeding.",
        team: "Animal Care",
      },
      Growls: {
        text: "Behavioral consult for food guarding.",
        team: "Behavioral",
      },
      Snaps: {
        text: "URGENT: Behavioral consult for food aggression.",
        team: "Behavioral Lead",
      },
      "Guards Toy": {
        text: "Assess resource guarding with toys.",
        team: "Behavioral",
      },
    },
  },
  INTAKE_MEDICAL: {
    fields: [
      { name: "Body Condition Score", placeholder: "e.g., 5/9" },
      {
        name: "Dental Health",
        placeholder: "e.g., Mild Tartar",
        redFlags: ["Severe Tartar", "Broken Tooth"],
      },
      {
        name: "Fleas Present",
        options: ["Yes", "No", "Treated"],
        redFlags: ["Yes"],
      },
      {
        name: "Heart/Lungs",
        placeholder: "e.g., Clear, no murmur",
        redFlags: ["Murmur Detected"],
      },
    ],
    suggestedTasks: {
      "Severe Tartar": {
        text: "Schedule vet check for dental issues.",
        team: "Medical",
      },
      "Broken Tooth": {
        text: "URGENT: Vet exam for dental trauma.",
        team: "Medical Lead",
      },
      Yes: { text: "Administer flea treatment.", team: "Medical" },
      "Murmur Detected": {
        text: "Schedule cardiac workup with vet.",
        team: "Medical",
      },
    },
  },
  DAILY_MONITORING: {
    fields: [
      {
        name: "Appetite",
        options: ["Normal", "Decreased", "Not Eaten"],
        redFlags: ["Decreased", "Not Eaten"],
      },
      {
        name: "Energy Level",
        options: ["Normal", "Lethargic", "Hyperactive"],
        redFlags: ["Lethargic"],
      },
      {
        name: "Stool Quality",
        options: ["Normal", "Loose", "Diarrhea"],
        redFlags: ["Loose", "Diarrhea"],
      },
    ],
    suggestedTasks: {
      "Not Eaten": { text: "Vet check for inappetence.", team: "Medical" },
      Lethargic: { text: "Monitor vitals and report to vet.", team: "Medical" },
      Diarrhea: { text: "Start GI-upset protocol.", team: "Medical" },
    },
  },
};

interface Props {
  animalId: string;
  assessmentTemplates: FormattedTemplates;
}

export const AssessmentForm = ({ animalId, assessmentTemplates }: Props) => {
  const [templateKey, setTemplateKey] =
    useState<TemplateKey>("INTAKE_BEHAVIORAL");
  const [fields, setFields] = useState<FormFieldState[]>([]);
  const [overallOutcome, setOverallOutcome] = useState("Good");
  const [summary, setSummary] = useState("");
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  // This effect resets the form whenever the template changes.
  React.useEffect(() => {
    const template = assessmentTemplates[templateKey];
    const newFields: FormFieldState[] = template.fields.map((field) => ({
      ...field,
      id: crypto.randomUUID(),
      value: "",
      notes: "",
      isPredefined: true,
    }));
    setFields(newFields);
    setSummary("");
    setOverallOutcome("Good");
    setCheckedTasks({});
  }, [templateKey]);

  // useMemo ensures this complex calculation only runs when `fields` changes.
  const { activeRedFlags, suggestedTasks } = useMemo(() => {
    const flags = new Map<string, string>();
    const tasks = new Map<string, SuggestedTask>();
    const template = assessmentTemplates[templateKey];

    fields.forEach((field) => {
      if (field.redFlags?.includes(field.value)) {
        flags.set(field.name, field.value);
        const taskConfig = template.suggestedTasks[field.value];
        if (taskConfig) {
          tasks.set(field.value, { key: field.value, ...taskConfig });
        }
      }
    });

    return {
      activeRedFlags: flags,
      suggestedTasks: Array.from(tasks.values()),
    };
  }, [fields, templateKey]);

  // Effect to auto-check new tasks that appear
  React.useEffect(() => {
    const newCheckedTasks: Record<string, boolean> = {};
    suggestedTasks.forEach((task) => {
      newCheckedTasks[task.key] = true;
    });
    setCheckedTasks(newCheckedTasks);
  }, [suggestedTasks]);

  // --- EVENT HANDLERS ---
  const handleFieldChange = (
    id: string,
    property: keyof FormFieldState,
    value: string
  ) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, [property]: value } : field
      )
    );
  };

  const addCustomField = () => {
    const newField: FormFieldState = {
      id: crypto.randomUUID(),
      name: "",
      value: "",
      notes: "",
      isPredefined: false,
      placeholder: "e.g., Calm",
    };
    setFields((prevFields) => [...prevFields, newField]);
  };

  const removeField = (id: string) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  const handleTaskCheckChange = (key: string) => {
    setCheckedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalTasks = suggestedTasks.filter((task) => checkedTasks[task.key]);
    const payload = {
      template: templateKey,
      animalId: "12345-buddy",
      assessorId: "current_user_id",
      overallOutcome,
      summary,
      fields: fields.map(({ id, name, value, notes }) => ({
        id,
        name,
        value,
        notes,
      })),
      createdTasks: finalTasks,
    };
    console.log("Submitting Payload:", payload);
    alert(
      "Assessment submitted! Check the browser console for the data payload."
    );
  };

  // --- RENDER ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Left Column: The Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-10">
        {/* Setup Section */}
        <fieldset className="space-y-6">
          <legend className="text-xl font-semibold text-foreground border-b pb-4 w-full">
            Setup
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label
                htmlFor="pet"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Pet to Assess
              </label>
              <select
                id="pet"
                className="form-select w-full h-10 rounded-md border border-input px-3 text-sm"
              >
                <option value="buddy">ID: 12345 - Buddy (Dog)</option>
                <option value="whiskers">ID: 12346 - Whiskers (Cat)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="assessmentTemplate"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Assessment Template
              </label>
              <select
                id="assessmentTemplate"
                value={templateKey}
                onChange={(e) => setTemplateKey(e.target.value as TemplateKey)}
                className="form-select w-full h-10 rounded-md border border-input px-3 text-sm"
              >
                <option value="INTAKE_BEHAVIORAL">Intake Behavioral</option>
                <option value="INTAKE_MEDICAL">Intake Medical</option>
                <option value="DAILY_MONITORING">Daily Monitoring</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Assessment Details Section */}
        <fieldset className="space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <legend className="text-xl font-semibold text-foreground">
              Assessment Details
            </legend>
            <button
              type="button"
              onClick={addCustomField}
              className="btn btn-outline px-3 h-9 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Field
            </button>
          </div>
          <div className="hidden md:grid md:grid-cols-[2fr_2fr_2fr_auto] gap-4 px-1 text-sm font-medium text-muted-foreground pt-2">
            <span>Field Name</span>
            <span>Value</span>
            <span>Notes</span>
          </div>
          <div className="space-y-4">
            {fields.map((field) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-[2fr_2fr_2fr_auto] gap-4 items-start p-2 rounded-lg"
              >
                <div>
                  {field.isPredefined ? (
                    <p className="flex items-center h-10 text-sm font-medium text-foreground">
                      {field.name}
                    </p>
                  ) : (
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) =>
                        handleFieldChange(field.id, "name", e.target.value)
                      }
                      placeholder="e.g., Reaction to dogs"
                      className="form-input h-10"
                    />
                  )}
                </div>
                <div>
                  {field.options ? (
                    <select
                      value={field.value}
                      onChange={(e) =>
                        handleFieldChange(field.id, "value", e.target.value)
                      }
                      className="form-select h-10 w-full"
                    >
                      <option value="">Select...</option>
                      {field.options.map((opt) => (
                        <option
                          key={opt}
                          value={opt}
                          className={
                            field.redFlags?.includes(opt)
                              ? "red-flag-option"
                              : ""
                          }
                        >
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        handleFieldChange(field.id, "value", e.target.value)
                      }
                      placeholder={field.placeholder}
                      className="form-input h-10"
                    />
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={field.notes}
                    onChange={(e) =>
                      handleFieldChange(field.id, "notes", e.target.value)
                    }
                    placeholder="Optional notes..."
                    className="form-input h-10"
                  />
                </div>
                <div className="flex items-center h-10">
                  <button
                    type="button"
                    onClick={() => removeField(field.id)}
                    disabled={field.isPredefined}
                    className="btn btn-ghost text-muted-foreground hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Summary Section */}
        <fieldset className="space-y-6">
          <legend className="text-xl font-semibold text-foreground border-b pb-4 w-full">
            Final Summary
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label
                htmlFor="overallOutcome"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Overall Outcome
              </label>
              <select
                id="overallOutcome"
                value={overallOutcome}
                onChange={(e) => setOverallOutcome(e.target.value)}
                className="form-select h-10 w-full"
              >
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
                <option className="red-flag-option">Needs Attention</option>
                <option>Monitor</option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Summary / Key Takeaways
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              className="form-textarea"
              placeholder="Briefly summarize the assessment findings..."
            ></textarea>
          </div>
        </fieldset>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button type="button" className="btn btn-outline px-6 h-10">
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary px-6 h-10 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Submit Assessment
          </button>
        </div>
      </form>

      {/* Right Column: Live Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <div
            className={`summary-panel bg-secondary rounded-lg p-6 border transition-all ${
              activeRedFlags.size > 0
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Live Summary & Recommended Actions
            </h3>
            {activeRedFlags.size > 0 && (
              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  🚩 Red Flags Identified
                </h4>
                {Array.from(activeRedFlags.entries()).map(([name, value]) => (
                  <div
                    key={name}
                    className="text-sm text-destructive-foreground bg-destructive/20 border-l-4 border-destructive p-3 rounded-r-md"
                  >
                    <span className="font-semibold">{name}:</span> {value}
                  </div>
                ))}
              </div>
            )}
            {suggestedTasks.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  ✅ Suggested Tasks
                </h4>
                {suggestedTasks.map((task) => (
                  <div
                    key={task.key}
                    className="flex items-start space-x-3 bg-card p-3 rounded-md border"
                  >
                    <input
                      type="checkbox"
                      id={`task-${task.key}`}
                      checked={!!checkedTasks[task.key]}
                      onChange={() => handleTaskCheckChange(task.key)}
                      className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-ring"
                    />
                    <label
                      htmlFor={`task-${task.key}`}
                      className="text-sm text-foreground"
                    >
                      {task.text}
                      <span className="block text-xs text-muted-foreground">
                        Assign to: {task.team}
                      </span>
                    </label>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-6 text-center">
                  Checked tasks will be automatically created upon submission.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}