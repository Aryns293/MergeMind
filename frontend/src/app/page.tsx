"use client";

import { useAuth } from "@/providers/auth-provider";
import { redirect } from "next/navigation";
import LandingPage from "@/components/landing/LandingPage";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return <LandingPage />;
}
