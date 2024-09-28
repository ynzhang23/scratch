import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { TextLayer } from "@/types/canvas";
import { cn, colorToCss } from "@/lib/utils";
import { useMutation } from "@/liveblocks.config"

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
})

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 100;
  const scaleFactor = 0.5;
  const fontSizeBasedOnWidth = width * scaleFactor;
  const fontSizeBasedOnHeight = height * scaleFactor;

  return Math.min(maxFontSize, fontSizeBasedOnWidth, fontSizeBasedOnHeight);
}

interface TextProps {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Text = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: TextProps) => {
  const { x, y, width, height, fill, value } = layer;

  const updateValue = useMutation((
    { storage },
    newValue: string
  ) => {
    const liveLayers = storage.get("layers");

    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  }

  return (
    <foreignObject
      x={x}
      y={y}
      height={height}
      width={width}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
      }}
    >
      <ContentEditable
        className={
          cn("h-full w-full flex items-center justify-center text-center drop-shadow-md outline-non", font.className)}
          style={{
            fontSize: calculateFontSize(width, height),
            color: fill ? colorToCss(fill) : "#000",
          }}
        html={value || "Text"}
        onChange={handleContentChange}
      />
    </foreignObject>
  )
}