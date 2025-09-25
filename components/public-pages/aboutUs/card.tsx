interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card = ({ title, children }: CardProps) => {
  return (
    <div className="bg-gray-50/50 px-8 py-5 border border-gray-200/50 rounded-2xl transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
};

export default Card;