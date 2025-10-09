const SectionCardsSkeleton = () => (
  <div className="shimmer-animation grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-[150px] bg-gray-100 border rounded-lg" />
    ))}
  </div>
);

export default SectionCardsSkeleton;