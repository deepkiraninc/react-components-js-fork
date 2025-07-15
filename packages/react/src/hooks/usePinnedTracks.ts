import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import * as React from 'react';
import type { LayoutContextType } from '../context';
import { useEnsureLayoutContext } from '../context';

/**
 * The `usePinnedTracks` hook returns a array of the pinned tracks of the current room.
 * @remarks
 * To function properly, this hook must be called within a `LayoutContext`.
 * @example
 * ```tsx
 * const pinnedTracks = usePinnedTracks();
 * ```
 * @public
 */
export function usePinnedTracks(layoutContext?: LayoutContextType): TrackReferenceOrPlaceholder[] {
  layoutContext = useEnsureLayoutContext(layoutContext);
  return React.useMemo(() => {
    if (layoutContext?.pin.state !== undefined && layoutContext.pin.state.length >= 1) {
      return layoutContext.pin.state;
    }
    return [];
  }, [layoutContext.pin.state]);
}

export function usePinnedElementTracks(layoutContext?: LayoutContextType): TrackReferenceOrPlaceholder[] {
  layoutContext = useEnsureLayoutContext(layoutContext);
  return React.useMemo(() => {
    if (layoutContext?.pinElement.state !== undefined && layoutContext.pinElement.state.length >= 1) {
      return layoutContext.pinElement.state;
    }
    return [];
  }, [layoutContext.pinElement.state]);
}
