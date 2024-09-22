"use client";

import { memo, use } from "react";
import { useOthersConnectionIds } from "@liveblocks/react";
import { connect } from "http2";
import { Cursor } from "./cursor";

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((connectionId) => (
        <Cursor 
          key = {connectionId}
          connectionId = {connectionId}
        />
      ))}
    </>
  );
};

export const CursorsPresence = memo(() => {
  return (
    <>
      {/* TODO: Draft pencil */}
      <Cursors />
    </>
  )
});

CursorsPresence.displayName = "CursorsPresence";