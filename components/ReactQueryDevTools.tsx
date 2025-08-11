"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function QueryDevTools() {
  // Only show devtools in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return <ReactQueryDevtools initialIsOpen={false} />;
}
