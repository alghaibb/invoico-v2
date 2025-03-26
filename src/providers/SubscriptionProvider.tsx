"use client";

import { SubscriptionType } from "@/utils/get-user-subscription";
import { createContext, useContext } from "react";

const SubscriptionPlanContext = createContext<SubscriptionType | undefined>(
  undefined
);

interface SubscriptionPlanProviderProps {
  children: React.ReactNode;
  userSubscription: SubscriptionType;
}

export default function SubscriptionProvider({
  children,
  userSubscription,
}: SubscriptionPlanProviderProps) {
  return (
    <SubscriptionPlanContext.Provider value={userSubscription}>
      {children}
    </SubscriptionPlanContext.Provider>
  );
}

export function useSubscriptionPlan() {
  const context = useContext(SubscriptionPlanContext);

  if (context === undefined) {
    throw new Error(
      "useSubscriptionPlan must be used within a SubscriptionProvider"
    );
  }

  return context;
}
