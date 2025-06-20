interface Props {
  title: string;
  description: string;
  className?: string;
}

const FormHeader = ({ title, description, className }: Props) => {
  return (
    <div className={className}>
      <h2 className="text-lg font-semibold leading-7 text-gray-900">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default FormHeader;