import type { PinState, TrackReferenceOrPlaceholder } from '@livekit/components-core';
import type * as React from 'react';

/** @internal */
export type PinElementAction =
  | {
      msg: 'set_pin';
      trackReference: TrackReferenceOrPlaceholder;
    }
  | { msg: 'clear_pin' };

/** @internal */
export type PinElementContextType = {
  dispatch?: React.Dispatch<PinElementAction>;
  state?: PinState;
};

/** @internal */
export function pinElementReducer(state: PinState, action: PinElementAction): PinState {
  if (action.msg === 'set_pin') {
    return [action.trackReference];
  } else if (action.msg === 'clear_pin') {
    return [];
  } else {
    return { ...state };
  }
}
