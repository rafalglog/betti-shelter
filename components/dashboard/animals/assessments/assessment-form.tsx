"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldType } from "@prisma/client";
import { DynamicFormField } from "@/app/lib/DynamicFormField";
import { createDynamicSchema } from "@/app/lib/dynamicFormSchema";
import { AssessmentFormData, TemplateField } from "@/app/lib/types";
import { createAssessment } from "@/app/lib/actions/animal-assessment.actions";
import { AssessmentTemplateWithFields } from "@/app/lib/data/animals/animal-assessment.data";
import { CustomFieldEditor } from "@/app/lib/CustomFieldEditor";

interface AssessmentFormProps {
  animalId: string;
  templates: AssessmentTemplateWithFields[];
}

export function AssessmentForm({ animalId, templates }: AssessmentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedTemplate, setSelectedTemplate] =
    useState<AssessmentTemplateWithFields | null>(null);
  const [customFields, setCustomFields] = useState<TemplateField[]>([]);

  // No changes needed here
  const allFields: TemplateField[] = selectedTemplate
    ? [
        ...(selectedTemplate.templateFields.map((field) => ({
          ...field,
          suggestionRules: field.suggestionRules as Record<
            string,
            { title: string; category: string }
          > | null,
        })) as TemplateField[]),
        ...customFields,
      ]
    : [...customFields];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(createDynamicSchema(allFields)),
    defaultValues: {},
  });

  useEffect(() => {
    reset({});
  }, [selectedTemplate, customFields, reset]);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    setSelectedTemplate(template || null);
    setCustomFields([]);
  };

  // No changes needed here
  const addCustomField = () => {
    if (!selectedTemplate?.allowCustomFields) return;
    const newField: TemplateField = {
      id: `custom_${Date.now()}`,
      label: "New Custom Field",
      fieldType: FieldType.TEXT,
      placeholder: "Enter value",
      options: [],
      isRequired: false,
      order:
        (selectedTemplate?.templateFields?.length || 0) +
        customFields.length +
        1,
      suggestionRules: null,
    };
    setCustomFields([...customFields, newField]);
  };

  // This function now needs to handle the full field object from the editor
  const updateCustomField = (updatedField: TemplateField) => {
    setCustomFields((prev) =>
      prev.map((field) => (field.id === updatedField.id ? updatedField : field))
    );
  };

  const removeCustomField = (fieldId: string) => {
    setCustomFields(customFields.filter((f) => f.id !== fieldId));
    setValue(fieldId, undefined);
    setValue(`${fieldId}_notes`, undefined);
  };

  const handleFormSubmit = async (data: any) => {
    if (!selectedTemplate) return;
    const assessmentData: AssessmentFormData = {
      animalId,
      templateId: selectedTemplate.id,
      customFields,
      ...data,
    };
    startTransition(() => createAssessment(assessmentData));
  };

  if (!selectedTemplate) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Select Assessment Template
        </h2>
        <select
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          onChange={(e) => handleTemplateChange(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Choose a template...
          </option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
      {/* Header remains the same */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedTemplate.name}
          </h2>
          <p className="text-gray-600">Type: {selectedTemplate.type}</p>
        </div>
        <button
          type="button"
          onClick={() => setSelectedTemplate(null)}
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          Change Template
        </button>
      </div>

      <fieldset>
        {/* Fieldset header remains the same */}
        <div className="flex justify-between items-center border-b pb-4">
          <legend className="text-xl font-semibold">Assessment Details</legend>
          {selectedTemplate.allowCustomFields && (
            <button
              type="button"
              onClick={addCustomField}
              className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-50"
            >
              + Add Field
            </button>
          )}
        </div>

        {/* Main fields grid */}
        <div className="space-y-4 pt-2">
          {allFields.map((field) => {
            const isCustom = field.id.startsWith("custom_");

            // For standard template fields, render the simple grid row
            if (!isCustom) {
              return (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-[2fr_2fr_2fr_auto] gap-4 items-start py-2 border-b border-gray-100"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 pt-2">
                      {field.label}
                      {field.isRequired && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                  </div>
                  <div>
                    <DynamicFormField
                      field={field}
                      control={control}
                      errors={errors}
                    />
                  </div>
                  <div>
                    <Controller
                      name={`${field.id}_notes`}
                      control={control}
                      render={({ field: controllerField }) => (
                        <input
                          type="text"
                          {...controllerField}
                          value={controllerField.value || ""}
                          placeholder="Optional notes..."
                          className="w-full p-2 border rounded-md text-sm"
                        />
                      )}
                    />
                  </div>
                  {/* Empty div for alignment */}
                  <div></div>
                </div>
              );
            }

            return (
              <div key={field.id} className="border-t border-b py-4">
                <CustomFieldEditor
                  field={field}
                  onUpdate={updateCustomField}
                  onRemove={removeCustomField}
                />
              </div>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-xl font-semibold text-foreground border-b pb-4 w-full">
          Final Summary
        </legend>
        <div className="pt-2">
          <DynamicFormField
            field={{
              id: "overallOutcome",
              label: "Overall Outcome",
              fieldType: FieldType.SELECT,
              isRequired: false,
              options: [
                "EXCELLENT",
                "GOOD",
                "FAIR",
                "POOR",
                "NEEDS_ATTENTION",
                "MONITOR",
                "NOT_APPLICABLE",
              ],
              order: 999,
              placeholder: null,
              suggestionRules: null,
            }}
            control={control}
            errors={errors}
          />
        </div>
        <div>
          <DynamicFormField
            field={{
              id: "summary",
              label: "Summary / Key Takeaways",
              fieldType: FieldType.TEXTAREA,
              isRequired: false,
              placeholder: "Briefly summarize the assessment findings...",
              options: [],
              order: 1000,
              suggestionRules: null,
            }}
            control={control}
            errors={errors}
          />
        </div>
      </fieldset>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Submit Assessment"}
        </button>
      </div>
    </form>
  );
}
