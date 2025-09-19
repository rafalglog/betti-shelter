import React from "react";
import { Control } from "react-hook-form";
import { FieldType } from "@prisma/client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { TemplateField } from "./types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface DynamicFormFieldProps {
  field: TemplateField;
  control: Control<any>;
}

export function DynamicFormField({ field, control }: DynamicFormFieldProps) {
  const renderInput = (controllerField: any) => {
    switch (field.fieldType) {
      case FieldType.TEXT:
        return (
          <Input
            placeholder={
              field.placeholder || `Enter ${field.label.toLowerCase()}`
            }
            {...controllerField}
          />
        );
      case FieldType.TEXTAREA:
        return (
          <Textarea
            placeholder={
              field.placeholder || `Enter ${field.label.toLowerCase()}`
            }
            rows={3}
            {...controllerField}
          />
        );
      case FieldType.NUMBER:
        return (
          <Input
            type="number"
            placeholder={field.placeholder || "0"}
            {...controllerField}
            onChange={(e) => controllerField.onChange(e.target.value === '' ? '' : Number(e.target.value))}
          />
        );
      case FieldType.SELECT:
        return (
          <Select
            onValueChange={controllerField.onChange}
            defaultValue={controllerField.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={field.placeholder || "Select an option"}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case FieldType.RADIO:
        return (
          <RadioGroup
            onValueChange={controllerField.onChange}
            defaultValue={controllerField.value}
            className="mt-2"
          >
            {field.options?.map((option) => (
              <FormItem key={option} className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                </FormControl>
                <FormLabel htmlFor={`${field.id}-${option}`} className="font-normal">
                  {option}
                </FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        );
      case FieldType.CHECKBOX:
        return (
          <div className="flex items-center space-x-2 h-10">
            <FormControl>
              <Checkbox
                checked={controllerField.value}
                onCheckedChange={controllerField.onChange}
                id={field.id}
              />
            </FormControl>
            <FormLabel htmlFor={field.id} className="font-normal">
              {field.label}
            </FormLabel>
          </div>
        );
      case FieldType.DATE:
        return (
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !controllerField.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {controllerField.value ? (
                    format(new Date(controllerField.value), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  controllerField.value ? new Date(controllerField.value) : undefined
                }
                onSelect={controllerField.onChange}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        );
      default:
        return <Input type="text" {...controllerField} />;
    }
  };

  return (
    <FormField
      control={control}
      name={field.id}
      render={({ field: controllerField }) => (
        <FormItem>
          {/* Checkbox label is rendered inside the switch case */}
          {field.fieldType !== FieldType.CHECKBOX && (
            <FormLabel>
              {field.label}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
          )}
          {/* We render the input inside a FormControl for non-checkbox/radio types */}
          {field.fieldType !== FieldType.CHECKBOX && field.fieldType !== FieldType.RADIO ? (
            <FormControl>{renderInput(controllerField)}</FormControl>
          ) : (
             renderInput(controllerField)
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}