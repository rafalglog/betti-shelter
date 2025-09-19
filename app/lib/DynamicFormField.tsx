// in @/app/lib/DynamicFormField.tsx

import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { FieldType } from "@prisma/client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { TemplateField } from "./types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface DynamicFormFieldProps {
  field: TemplateField;
  control: Control<any>;
  errors: FieldErrors<any>;
}

export function DynamicFormField({ field, control, errors }: DynamicFormFieldProps) {
  const renderField = (onChange: (value: any) => void, value: any) => {
    switch (field.fieldType) {
      case FieldType.TEXT:
        return (
          <Input
            type="text"
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            onChange={(e) => onChange(e.target.value)}
            value={value || ""}
          />
        );
      case FieldType.TEXTAREA:
        return (
          <Textarea
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows={3}
            onChange={(e) => onChange(e.target.value)}
            value={value || ""}
          />
        );
      case FieldType.NUMBER:
        return (
          <Input
            type="number"
            placeholder={field.placeholder || "0"}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
            value={value || ""}
          />
        );
      case FieldType.SELECT:
        return (
          <Select onValueChange={onChange} value={value || ""}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
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
          <RadioGroup onValueChange={onChange} value={value || ""} className="mt-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case FieldType.CHECKBOX:
        return (
           <div className="flex items-center space-x-2 h-10">
            <Checkbox
              id={field.id}
              checked={value || false}
              onCheckedChange={onChange}
            />
            <Label htmlFor={field.id} className="font-normal">
              {field.label}
            </Label>
          </div>
        );
      case FieldType.DATE:
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      default:
        return <Input type="text" value={value || ""} onChange={onChange} />;
    }
  };

  return (
    <div className="w-full">
      {field.fieldType !== FieldType.CHECKBOX && (
        <Label className="mb-2 block">
          {field.label}
          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Controller
        name={field.id}
        control={control}
        render={({ field: controllerField }) => (
          renderField(controllerField.onChange, controllerField.value)
        )}
      />
    </div>
  );
}