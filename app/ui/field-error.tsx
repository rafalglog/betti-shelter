interface Props {
  id: string;
  errors: string | string[] | undefined | null;
}

/**
 * FieldError component to display error messages for a form field.
 *
 * @param props - The properties for the FieldError component.
 * @param props.id - The ID of the error container.
 * @param props.errors - A single error message string, an array of error messages, or undefined/null.
 * @returns A JSX element containing error messages or null if no errors exist.
 */
const FieldError = ({ id, errors }: Props) => {
  // If there are no errors, or if it's an empty array, render nothing
  if (!errors || (Array.isArray(errors) && errors.length === 0)) {
    return null;
  }

  const errorParagraphClassName = "mt-2 text-sm text-red-500";

  // Otherwise, render the error container
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {typeof errors === 'string' ? (
        <p className={errorParagraphClassName} key={errors}>
          {errors}
        </p>
      ) : (
        errors.map((error: string, index: number) => (
          <p className={errorParagraphClassName} key={`${error}-${index}`}>
          {error}
        </p>
      )))}
    </div>
  );
};

export default FieldError;
