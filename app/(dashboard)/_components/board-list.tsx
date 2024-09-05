"use client";

import Image from "next/image";
import { EmptySearch } from "./empty-search";
import { EmptyFavorites } from "./empty-favorites";
import { EmptyBoards } from "./empty-boards";

interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BoardList = ({
  orgId,
  query,
 } : BoardListProps) => {
  const data = [];

  // If no boards with search query are found
  if (!data?.length && query.search) {
    return (
        <EmptySearch />
    )
  }

  // If no boards are favorited
  if (!data?.length && query.favorites) {
    return (
      <EmptyFavorites />
    )
  }

  if (!data?.length) {  
    return (
      <EmptyBoards />
    )
  }
};