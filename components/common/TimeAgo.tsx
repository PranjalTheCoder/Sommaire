// components/common/time-ago.tsx
"use client";

import { formatDistanceToNow } from "date-fns";

export default function TimeAgo({ date }: { date: string }) {
  return (
    <span className="text-sm text-gray-500">
      {formatDistanceToNow(new Date(date), { addSuffix: true })}
    </span>
    //  <p className="text-sm text-gray-500">2025</p>
  );
}
