"use client";

import { Loader2 } from "lucide-react";

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({
  text = "Loading...",
  fullScreen = false,
}: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}