interface BadgeProps {
  children: React.ReactNode;
}

export default function Badge({
  children,
}: BadgeProps) {
  return (
    <span
      className="
      inline-flex
      rounded-full
      bg-green-100
      px-3
      py-1
      text-xs
      font-semibold
      text-green-700
    "
    >
      {children}
    </span>
  );
}