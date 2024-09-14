"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { ConfirmModal } from "./confirm-modal";
import { Button } from "@/components/ui/button";

import { 
  Link2,
  Pencil,
  Trash
} from "lucide-react";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";

import { toast } from "sonner";
import { useRenameModal } from "@/store/use-rename-modal";

interface ActionsProps {
  children?: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionsProps) => {
  const { onOpen } = useRenameModal();
  const { mutate, pending } = useApiMutation(api.board.remove);
  
  const onCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/board/${id}`)
    .then(() => toast.success("Link copied"))
    .catch(() => toast.error("Failed to copy link"))
  }

  const onDelete = () => {
    mutate({
      id
    })
    .then(() => {toast.success("Board deleted")})
    .catch(() => toast.error("Failed to delete board"))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        onClick={(e) => e.stopPropagation()}
        side={side} 
        sideOffset={sideOffset}
        className="w-60"
      >
        <DropdownMenuItem 
          className="p-3 cursor-pointer"
          onClick={onCopyLink}
        >
          <Link2 className="w-5 h-5 mr-2" />
          Copy board link
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="p-3 cursor-pointer"
          onClick={() => onOpen(id, title)}
        >
          <Pencil className="w-5 h-5 mr-2" />
          Rename board
        </DropdownMenuItem>
        <ConfirmModal
          onConfirm={onDelete}
          header="Are you sure you want to delete this board?"
          disabled={pending}
        >
          <Button 
            variant="ghost"
            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
          >
            <Trash className="w-5 h-5 mr-2" />
            Delete board
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}