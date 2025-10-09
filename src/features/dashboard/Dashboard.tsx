import * as React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-3xl font-bold text-primary">FoamBoss Dashboard</h1>
      <p className="mt-4 text-default-500">
        Welcome to the MVP. Let’s start building.
      </p>
    </div>
  );
}
