interface Props {
  title: string;
  description?: string;
}

const PublicPageHeader = ({ title, description }: Props) => {
  return (
    <div className="mb-12 text-left">
      <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="mt-5 text-gray-600 tracking-wide">
          {description}
        </p>
      )}
    </div>
  );
};

export default PublicPageHeader;