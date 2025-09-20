"use client";

import React, { useState, useEffect, startTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldType, AssessmentType } from "@prisma/client";
import { DynamicFormField } from "@/app/lib/DynamicFormField";
import { createDynamicSchema } from "@/app/lib/dynamicFormSchema";
import { TemplateField } from "@/app/lib/types";
import { createAssessment } from "@/app/lib/actions/animal-assessment.actions";
import { AssessmentTemplateWithFields } from "@/app/lib/data/animals/animal-assessment.data";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useActionState } from "react";
import { INITIAL_FORM_STATE } from "@/app/lib/form-state-types";
import Link from "next/link";
import { assessmentOutcomeOptions } from "@/app/lib/utils/enum-formatter";

interface AssessmentFormProps {
  animalId: string;
  templates: AssessmentTemplateWithFields[];
}

export function AssessmentForm({ animalId, templates }: AssessmentFormProps) {
  const [state, formAction, isPending] = useActionState(
    createAssessment,
    INITIAL_FORM_STATE
  );

  const [selectedTemplate, setSelectedTemplate] =
    useState<AssessmentTemplateWithFields | null>(() => {
      return (
        templates.find((t) => t.type === AssessmentType.DAILY_MONITORING) ||
        templates[0] ||
        null
      );
    });

  const allFields: TemplateField[] = selectedTemplate
    ? selectedTemplate.templateFields
    : [];

  // Dynamically generate default values
  const generateDefaultValues = (fields: TemplateField[]) => {
    const defaultVals: { [key: string]: any } = {
      overallOutcome: "",
      summary: "",
    };

    fields.forEach((field) => {
      // Checkboxes must default to a boolean, others can be an empty string
      defaultVals[field.id] =
        field.fieldType === FieldType.CHECKBOX ? false : "";
      defaultVals[`${field.id}_notes`] = "";
    });

    return defaultVals;
  };

  // Rename useForm result to 'form' for clarity
  const form = useForm<any>({
    resolver: zodResolver(createDynamicSchema(allFields)),
    defaultValues: generateDefaultValues(allFields),
  });

  const { control, reset, setError } = form;

  useEffect(() => {
    // When the template changes, reset the form with the new structure
    reset(generateDefaultValues(allFields));
  }, [allFields, reset]);

  // Handle form errors from the server action
  useEffect(() => {
    if (state.message && state.errors) {
      toast.error(state.message);
    }
    if (state.errors) {
      for (const [key, value] of Object.entries(state.errors)) {
        if (value) {
          setError(key as any, {
            type: "server",
            message: value.join(", "),
          });
        }
      }
    }
  }, [state, setError]);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    setSelectedTemplate(template || null);
  };

  const handleFormSubmit = async (data: any) => {
    if (!selectedTemplate) return;

    const formData = new FormData();
    formData.append("animalId", animalId);
    formData.append("templateId", selectedTemplate.id);

    // Append all form data to FormData object
    for (const key in data) {
      const value = data[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  if (!selectedTemplate) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>No Templates Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please add a template to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Template Selector */}
          <FormItem className="col-span-full">
            <FormLabel htmlFor="template-switcher">
              Assessment Template
            </FormLabel>
            <Select
              value={selectedTemplate.id}
              onValueChange={handleTemplateChange}
            >
              <FormControl>
                <SelectTrigger id="template-switcher">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>

          <Separator className="col-span-full" />

          {/* Dynamic fields from the template */}
          {allFields.map((field) => (
            <React.Fragment key={field.id}>
              <div className="md:col-span-2">
                <DynamicFormField field={field} control={form.control} />
              </div>

              <div className="md:col-span-4">
                {field.fieldType !== FieldType.CHECKBOX && (
                  <FormLabel
                    htmlFor={`${field.id}_notes`}
                    className="mb-2 block"
                  >
                    Optional Notes
                  </FormLabel>
                )}
                <Controller
                  name={`${field.id}_notes`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Input
                      {...controllerField}
                      id={`${field.id}_notes`}
                      placeholder="Add a note..."
                      value={controllerField.value || ""}
                    />
                  )}
                />
              </div>
            </React.Fragment>
          ))}

          <div className="md:col-span-2">
            {/* Summary fields */}
            <DynamicFormField
              field={{
                id: "overallOutcome",
                label: "Overall Outcome",
                fieldType: FieldType.SELECT,
                isRequired: false,
                options: assessmentOutcomeOptions,
                order: 999,
                placeholder: null,
              }}
              control={form.control}
            />
          </div>

          <div className="col-span-full">
            <DynamicFormField
              field={{
                id: "summary",
                label: "Summary / Key Takeaways",
                fieldType: FieldType.TEXTAREA,
                isRequired: false,
                placeholder: "Briefly summarize the assessment findings...",
                options: [],
                order: 1000,
              }}
              control={form.control}
            />
          </div>

          {/* Form Actions */}
          <div className="col-span-full flex justify-end space-x-2 pt-4">
            <Button
              asChild
              variant="outline"
              type="button"
              disabled={isPending}
            >
              <Link href={`/dashboard/animals/${animalId}/assessments`}>
                Cancel
              </Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Assessment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
