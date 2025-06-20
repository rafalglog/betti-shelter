import { Select } from "@headlessui/react";
import FormField from "./form-field";

interface Props {
  className?: string;
  label: string;
  id: string;
  name?: string;
  required?: boolean;
  errors?: string[];
  defaultValue?: string | number | undefined;
  value?: string | number | undefined;
  canManage?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

const FormSelect = ({
  className,
  label,
  id,
  errors,
  name,
  required = false,
  defaultValue,
  value,
  canManage = false,
  onChange,
  children,
}: Props) => {
  return (
    <FormField label={label} id={id} errors={errors} className={className} >
      <Select
        id={id}
        name={name || id}
        autoComplete="off"
        required={required}
        aria-describedby={`${id}-error`}
        value={value}
        defaultValue={defaultValue}
        disabled={!canManage}
        onChange={onChange}
        className="block capitalize w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200"
      >
        {children}
      </Select>
    </FormField>
  );
};

export default FormSelect;
