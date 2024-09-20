"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";

export const EmptyBoards = () => {
  const router = useRouter();
  const { mutate, pending } = useApiMutation(api.board.create);
  const { organization } = useOrganization();

  const onClick = () => {
    // If no organization exists return
    if (!organization) return;
    mutate({
      orgId: organization.id,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Board created");
        router.push(`/board/${id}`)
      })
      .catch(() => toast.error("Failed to create board"));
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
        <Button disabled={pending} onClick={onClick} size="lg">
          Create Board
        </Button>
      </div>
    </div>
  )
}