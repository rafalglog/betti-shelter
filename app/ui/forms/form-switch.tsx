"use client";

import { Switch } from "@headlessui/react";
import FormField from "./form-field";

interface FormSwitchProps {
  className?: string;
  label: string;
  id: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  errors?: string[] | string;
  description?: string;
  srOnlyLabel?: string;
  value?: string;
}

const FormSwitch = ({
  className,
  label,
  id,
  name,
  checked,
  onChange,
  disabled = false,
  errors,
  description,
  srOnlyLabel,
  value,
}: FormSwitchProps) => {
  const fieldName = name || id;
  const errorId = `${id}-error-message`;
  const descriptionId = `${id}-description`;

  const hasError =
    errors && (Array.isArray(errors) ? errors.length > 0 : !!errors);

  return (
    <FormField label={label} id={id} errors={errors} className={className}>
      <Switch
        id={id}
        name={fieldName}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        value={value}
        className={`
            ${checked ? "bg-green-600" : "bg-gray-200"}
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2
            border-transparent transition-colors duration-200 ease-in-out focus:outline-none
            focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
          `}
        aria-describedby={
          hasError ? errorId : description ? descriptionId : undefined
        }
      >
        <span className="sr-only">{srOnlyLabel || label}</span>
        <span
          aria-hidden="true"
          className={`
              ${checked ? "translate-x-5" : "translate-x-0"}
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
              transition duration-200 ease-in-out
           `}
        />
      </Switch>
    </FormField>
  );
};

export default FormSwitch;