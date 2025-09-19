"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldType, Prisma } from "@prisma/client";
import { DynamicFormField } from "@/app/lib/DynamicFormField";
import { createDynamicSchema } from "@/app/lib/dynamicFormSchema";
import { AssessmentFormData, TemplateField } from "@/app/lib/types";
import { createAssessment } from "@/app/lib/actions/animal-assessment.actions";
import { AssessmentTemplateWithFields } from "@/app/lib/data/animals/animal-assessment.data";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssessmentFormProps {
  animalId: string;
  templates: AssessmentTemplateWithFields[];
}

export function AssessmentForm({ animalId, templates }: AssessmentFormProps) {
  const [isPending, startTransition] = useTransition();

  const [selectedTemplate, setSelectedTemplate] =
    useState<AssessmentTemplateWithFields | null>(() => {
      return (
        templates.find((t) => t.name === "Daily Monitoring") ||
        templates[0] ||
        null
      );
    });

  const allFields: TemplateField[] = selectedTemplate
    ? selectedTemplate.templateFields
    : [];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(createDynamicSchema(allFields)),
    defaultValues: {},
  });

  useEffect(() => {
    reset({});
  }, [selectedTemplate, reset]);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    setSelectedTemplate(template || null);
  };

  const handleFormSubmit = async (data: any) => {
    if (!selectedTemplate) return;
    const assessmentData: AssessmentFormData = {
      animalId,
      templateId: selectedTemplate.id,
      ...data,
    };
    startTransition(() => createAssessment(assessmentData));
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>{selectedTemplate.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Type: {selectedTemplate.type}
            </p>
          </div>
          <div className="w-1/3">
            <Label htmlFor="template-switcher" className="sr-only">
              Switch Template
            </Label>
            <Select
              value={selectedTemplate.id}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger id="template-switcher">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {allFields.map((field) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start py-2"
            >
              <DynamicFormField
                field={field}
                control={control}
                errors={errors}
              />
              <div className="w-full">
                {field.fieldType !== FieldType.CHECKBOX && (
                  <Label className="mb-2 block">Optional Notes</Label>
                )}
                <Controller
                  name={`${field.id}_notes`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Input
                      {...controllerField}
                      value={controllerField.value || ""}
                      placeholder="Add a note..."
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Final Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            }}
            control={control}
            errors={errors}
          />
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
            control={control}
            errors={errors}
          />
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Assessment"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
