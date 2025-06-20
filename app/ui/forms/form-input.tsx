import { Input } from "@headlessui/react";
import FormField from "./form-field";

interface Props {
  className?: string;
  label: string;
  id: string;
  type: string;
  required?: boolean; 
  errors?: string[];
  defaultValue: string | number | undefined;
  canManage?: boolean;
  placeholder?: string;
}

const FormInput = ({
  className,
  label,
  id,
  type,
  errors,
  required = false,
  defaultValue,
  canManage = false,
  placeholder
}: Props) => {
  return (
    <FormField label={label} id={id} errors={errors} className={className}>
      <Input
        type={type}
        id={id}
        name={id}
        required={required}
        autoComplete="off"
        aria-describedby={`${id}-error`}
        defaultValue={defaultValue}
        disabled={!canManage}
        placeholder={placeholder}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200"
      />
    </FormField>
  );
};

export default FormInput;
