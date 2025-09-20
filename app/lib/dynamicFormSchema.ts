import { z } from "zod";
import { FieldType, AssessmentOutcome } from "@prisma/client";
import { TemplateField } from "./types";

export function createDynamicSchema(fields: TemplateField[]) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.fieldType) {
      case FieldType.TEXT:
      case FieldType.TEXTAREA:
        fieldSchema = z.string().min(1, `${field.label} is required`);
        break;
      case FieldType.NUMBER:
        fieldSchema = z.coerce
          .number()
          .min(0, `${field.label} must be a positive number`);
        break;
      case FieldType.SELECT:
      case FieldType.RADIO:
        if (field.options && field.options.length > 0) {
          fieldSchema = z.enum(field.options as [string, ...string[]], {
            errorMap: () => ({
              message: `Please select a valid ${field.label}`,
            }),
          });
        } else {
          fieldSchema = z.string().min(1, `${field.label} is required`);
        }
        break;
      case FieldType.CHECKBOX:
        fieldSchema = z.boolean();
        break;
      case FieldType.DATE:
        fieldSchema = z.coerce.date({
          errorMap: () => ({ message: `${field.label} must be a valid date` }),
        });
        break;
      default:
        fieldSchema = z.string().min(1, `${field.label} is required`);
    }

    // Apply optional if not required
    if (!field.isRequired) {
      fieldSchema = fieldSchema.optional().or(z.literal(""));
    }

    schemaFields[field.id] = fieldSchema;

    // Add a corresponding optional notes field for each assessment field
    schemaFields[`${field.id}_notes`] = z.string().optional();
  });

  // Add overall outcome and summary fields
  schemaFields.overallOutcome = z
    .enum(Object.values(AssessmentOutcome) as [string, ...string[]]) // 👈 Use the enum values
    .optional();
  schemaFields.summary = z.string().optional();

  return z.object(schemaFields);
}