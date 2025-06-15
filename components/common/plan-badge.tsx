// components/plan-badge.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function PlanBadge() {
  const { user, isLoaded } = useUser();
  const [planName, setPlanName] = useState<string>("");

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchPlan = async () => {
      const email = user.emailAddresses[0]?.emailAddress;
      if (!email) return;
      const res = await fetch(`/api/get-user-plan?email=${email}`);
      const data = await res.json();
      if (data?.planName) setPlanName(data.planName);
    };

    fetchPlan();
  }, [user, isLoaded]);

  if (!planName) return null;

  return (
    <div className="text-sm bg-gray-100 px-2 py-1 rounded-md text-gray-700">
      {planName}
    </div>
  );
}
