"use client";

import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        Authenticated User!
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  );
}