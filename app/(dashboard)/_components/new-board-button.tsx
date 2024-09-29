"use-client"

import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import {cn} from "@/lib/utils";
import {Plus} from "lucide-react";
import {toast } from "sonner"; 
import { useRouter } from "next/navigation";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

export const NewBoardButton = ({
    orgId,
    disabled,
  }: NewBoardButtonProps) => {
  const router = useRouter();
  const { mutate, pending } = useApiMutation(api.board.create);
  const create = useApiMutation(api.board.create);

  const onClick = () => {
    mutate({
      orgId,
      title: "Untitled",
    })
    .then((id) => {
      toast.success("Board created");
      router.push(`/board/${id}`)
    })
    .catch(() => toast.error("Failed to create board"));
  }
  

  return (
    <button
      disabled={pending || disabled}
      onClick={onClick}
      className={cn(
        "col-span-1 aspect-[100/127] bg-slate-100 rounded-lg hover:bg-slate-300 flex flex-col items-center justify-center py-6",
        (disabled || pending ) && "cursor-not-allowed opacity-75 hover:bg-slate-400"
      )}
    >
      <div />
      <Plus className="h-12 w-12 text-black stroke-1" />
      <div className="text-black mt-1 text-sm">
        New board
      </div>
    </button>
  )
}