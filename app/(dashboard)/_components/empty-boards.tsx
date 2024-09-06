"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export const EmptyBoards = () => {
  const create = useMutation(api.board.create);
  const { organization } = useOrganization();

  const onClick = () => {
    // If no organization exists return
    if (!organization) return;

    create({
      orgId: organization.id,
      title: "Untitled",
    })
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image 
        src="/no-boards.svg"
        alt="Empty"
        height={400}
        width={400}
      />
      <h2 className="text-2xl font-semibold mt-6">
        No boards found
      </h2>
      <p className="text-muted-foreground textg-sm mt-2">
        Try creating a new board for your organization.
      </p>
      <div className="mt-6">
        <Button onClick={onClick} size="lg">
          Create Board
        </Button>
      </div>
    </div>
  )
}