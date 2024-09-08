"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterProps {
  isFavorite: boolean;
  title: string;
  authorLabel: string;
  createdAtLabel: string;
  onClick: () => void;
  disabled: boolean;
}

export const Footer = ( { 
  isFavorite,
  title,
  authorLabel,
  createdAtLabel,
  onClick,
  disabled,
}: FooterProps) => {
  return (
    <div className="relative bg-white p-3">
      {/* 20px is used for the favorite button */}
      <p className="text-[13px] truncate max-w-[calc(100%-20px)]">
        {title}
      </p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground">
        {authorLabel}, {createdAtLabel}
      </p>
      <button
        disabled={disabled}
        onClick={onClick}
        className={
          cn("opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 text-muted-foreground hover:text-orange-600",
          disabled && "cursor-not-allowed opacity-75")
        }
      >
        <Star 
          className={
            cn("w-4 h-4",
            isFavorite && "fill-orange-600")
          }
        />
      </button>
    </div>
  )
}