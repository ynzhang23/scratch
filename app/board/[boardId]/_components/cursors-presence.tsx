"use client";

import { memo, use } from "react";
import { shallow, useOthersConnectionIds } from "@liveblocks/react";
import { connect } from "http2";
import { Cursor } from "./cursor";
import { useOthersMapped } from "@/liveblocks.config";
import { Path } from "./layer-path";
import { colorToCss } from "@/lib/utils";

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

const Drafts = () => {
  const others = useOthersMapped((other) => ({
    pencilDraft: other.presence.pencilDraft,
    pencilColor: other.presence.pencilColor,
  }), shallow)

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
          return (
            <Path
              key={key}
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.pencilColor ? colorToCss(other.pencilColor) : "black"}
            />
          )
        }
        return null;
      })}
    </>
  )
};

export const CursorsPresence = memo(() => {
  return (
    <>
      <Drafts />
      <Cursors />
    </>
  )
});

CursorsPresence.displayName = "CursorsPresence";