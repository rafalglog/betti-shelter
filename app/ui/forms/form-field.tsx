import { Field, Label } from "@headlessui/react";
import FieldError from "../field-error";

interface FormFieldProps {
  label: string;
  id: string;
  errors: string | string[] | undefined | null;
  className?: string;
  children: React.ReactNode;
}

const FormField = ({
  label,
  id,
  errors,
  className,
  children,
}: FormFieldProps) => {
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <Field>
        <Label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-gray-900 mb-2"
        >
          {label}
        </Label>
        {children}
      </Field>
      <FieldError id={errorId} errors={errors} />
    </div>
  );
};

export default FormField;
