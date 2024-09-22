"use client";

import { nanoid } from "nanoid";
import { useState, useCallback, useMemo } from "react";
import { 
  Camera, 
  CanvasMode, 
  CanvasState, 
  Color, 
  Layer, 
  LayerType, 
  Point, 
  Side,
  XYWH
} from "@/types/canvas";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { 
  useHistory, 
  useCanRedo, 
  useCanUndo, 
  useMutation,
  useStorage,
  useOthersMapped,
} from "@/liveblocks.config";
import { CursorsPresence } from "./cursors-presence";
import { connectionIdToColor, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";

const MAX_LAYERS = 100; // Maximum number of layers


interface CanvasProps {
  boardId: string;
};

export const Canvas = ({
  boardId
}:CanvasProps) => {
  const layerIds = useStorage((root) => root.layerIds);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 255,
    g: 255,
    b: 255
  });

  const [camera, setCamera] = useState<Camera>({x: 0, y:0});

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  // Function to insert a new layer
  // This function takes layer type and position as arguments
  // It creates a new layer object and inserts it into the layers map
  const insertLayer = useMutation((
    { storage, setMyPresence }, 
    layerType: 
    LayerType.Ellipse | 
    LayerType.Note | 
    LayerType.Rectangle | 
    LayerType.Text,
    position: Point
  ) => {
    // Get the layers map and layer ids list from storage
    const liveLayers = storage.get("layers");
    if (liveLayers.size >= MAX_LAYERS) {
      return;
    }

    const liveLayerIds = storage.get("layerIds");
    const layerId = nanoid();
    let temp: Layer;
    temp = {
      type: layerType,
      x: position.x,
      y: position.y,
      width: 100,
      height: 100,
      fill: lastUsedColor,
    };
    const layer = new LiveObject(temp);

    liveLayerIds.push(layerId);
    liveLayers.set(layerId, layer);

    // Allows multiple mutations to be batched into a single operation
    setMyPresence({ selection: [layerId] }, { addToHistory: true });
    setCanvasState({ mode: CanvasMode.None });
  }, [lastUsedColor]);

  const onPointerUp = useMutation((
    {},
    e
  ) => {
    // Reuse the pointer event to get the canvas point
    const point = pointerEventToCanvasPoint(e, camera);

    console.log({
      point,
      canvasState,
    })
    
    // If the canvas mode is Inserting, insert a new layer
    if (canvasState.mode === CanvasMode.Inserting) {
      insertLayer(canvasState.layerType, point);
    } else {
      setCanvasState({ mode: CanvasMode.None });
    }
    history.resume();
  }, 
  [
    camera,
    canvasState,
    history,
    insertLayer,
  ]);

  // Function to handle pointer down event on resize handle
  const onResizeHandlePointerDown = useCallback((
    corner: Side,
    initialBounds: XYWH
  ) => {
    console.log(
      corner,
      initialBounds
    )
    history.pause();
    setCanvasState({
      mode: CanvasMode.Resizing,
      initialBounds,
      corner
    });
  }, [history]);

  const resizeSelectedLayer = useMutation((
    { storage, self },
    point: Point,
  ) => {
    if (canvasState.mode !== CanvasMode.Resizing) {
      return;
    }
    
    const bounds = resizeBounds(
      canvasState.initialBounds,
      canvasState.corner,
      point
    );

    const liveLayers = storage.get("layers");
    const layer = liveLayers.get(self.presence.selection[0]);

    if (layer) {
      layer.update(bounds);
    } 
  }, [canvasState]);

  const onWheel = useCallback((e: React.WheelEvent) => {  
    // console.log({
    //   x: e.deltaX,
    //   y: e.deltaY,
    // });
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerMove = useMutation((
    { setMyPresence }, 
    e: React.PointerEvent) => {
    e.preventDefault();

    // Convert pointer event to canvas point
    const current = pointerEventToCanvasPoint(e, camera);

    if (canvasState.mode === CanvasMode.Translating) {
      console.log("TRANSLATING");
    }
    else if (canvasState.mode === CanvasMode.Resizing) {
      resizeSelectedLayer(current);
    }

    setMyPresence({ cursor: current });
  }, [
    canvasState, 
    resizeSelectedLayer, 
    camera
  ]);

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const selections = useOthersMapped((other) => other.presence.selection);

  const onLayerPointerDown = useMutation((
    {self, setMyPresence},
    e: React.PointerEvent,
    layerId: string,
  ) => {
    if (
      canvasState.mode === CanvasMode.Pencil ||
      canvasState.mode === CanvasMode.Inserting
    ) {
      return;
    }

    history.pause();
    e.stopPropagation();

    const point = pointerEventToCanvasPoint(e, camera);
    if(!self.presence.selection.includes(layerId)) {
      setMyPresence({ selection: [layerId] }, { addToHistory: true });
    }
    setCanvasState({ mode: CanvasMode.Translating, current: point });
  }, [
    setCanvasState,
    camera,
    history,
    canvasState.mode,
  ]);

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    // Iterate over selections and assign a color to each layer
    // Selection color assigned is based on the connection id (user id)
    for (const user of selections) {
      const [connectionId, selection] = user;
      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  return (
    <main
      className = "h-full w-full relative bg-neutral-100 touch-none"
    >
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        redo={history.redo}
        undo={history.undo}
      />
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
            key={layerId}
            id={layerId}
            onLayerPointerDown={onLayerPointerDown}
            selectionColor={layerIdsToColorSelection[layerId]}
             />
          ))}
          <SelectionBox 
            onResizeHandlePointerDown={onResizeHandlePointerDown}
          />
          <CursorsPresence />
        </g>
      </svg>
    </main>
  )
}