import { PackageSearch } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "Nothing Found",
  description = "There is nothing to display.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <PackageSearch
        className="mb-4 h-14 w-14 text-gray-400"
      />

      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-gray-500">
        {description}
      </p>
    </div>
  );
}