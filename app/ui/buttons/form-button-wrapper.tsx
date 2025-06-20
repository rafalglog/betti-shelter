import FieldError from "../field-error";

interface Props {
  id: string;
  errors: string | string[] | undefined | null;
  children: React.ReactNode;
}

const FormButtonWrapper = ({ id, errors, children }: Props ) => {
  return (
    <div className="flex flex-col items-end gap-4">
      {/* General Errors */}
      <FieldError id={`${id}-error`} errors={errors} />
      <div className="flex items-center gap-x-6">
        {children}
      </div>
    </div>
  );
};

export default FormButtonWrapper;
