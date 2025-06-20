import { Textarea } from "@headlessui/react";
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
  rows?: number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  TextAreaDescription?: string;
}

const FormTextArea = ({
  className,
  label,
  id,
  errors,
  name,
  required = false,
  defaultValue,
  value,
  canManage = false,
  rows,
  onChange,
  TextAreaDescription,
}: Props) => {
  return (
    <FormField label={label} id={id} errors={errors} className={className}>
      <Textarea
        id={id}
        name={name || id}
        required={required}
        autoComplete="off"
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        disabled={!canManage}
        onChange={onChange}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm sm:leading-6"
      />
      {TextAreaDescription && (
        <p className="mt-3 text-sm leading-6 text-gray-600">
          {TextAreaDescription}
        </p>
      )}
    </FormField>
  );
};

export default FormTextArea;
