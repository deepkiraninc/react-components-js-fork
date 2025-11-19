import * as React from 'react';
import { useMaybeRoomContext } from '../../context';
import { mergeProps } from '../../utils';
import { Track, RoomEvent, type LocalAudioTrack, type LocalVideoTrack } from 'livekit-client';
import { useMediaDeviceSelect } from '../../hooks';

/** @public */
export interface MediaDeviceSelectProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onError'> {
  kind: MediaDeviceKind;
  onActiveDeviceChange?: (deviceId: string) => void;
  onDeviceListChange?: (devices: MediaDeviceInfo[]) => void;
  onDeviceSelectError?: (e: Error) => void;
  initialSelection?: string;
  /** will force the browser to only return the specified device
   * will call `onDeviceSelectError` with the error in case this fails
   */
  exactMatch?: boolean;
  track?: LocalAudioTrack | LocalVideoTrack;
  /**
   * this will call getUserMedia if the permissions are not yet given to enumerate the devices with device labels.
   * in some browsers multiple calls to getUserMedia result in multiple permission prompts.
   * It's generally advised only flip this to true, once a (preview) track has been acquired successfully with the
   * appropriate permissions.
   *
   * @see {@link MediaDeviceMenu}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices | MDN enumerateDevices}
   */
  requestPermissions?: boolean;
  onError?: (e: Error) => void;
}

/**
 * The `MediaDeviceSelect` list all media devices of one kind.
 * Clicking on one of the listed devices make it the active media device.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <MediaDeviceSelect kind='audioinput' />
 * </LiveKitRoom>
 * ```
 * @public
 */
export const MediaDeviceSelect = /* @__PURE__ */ React.forwardRef<
  HTMLUListElement,
  MediaDeviceSelectProps
>(function MediaDeviceSelect(
  {
    kind,
    initialSelection,
    onActiveDeviceChange,
    onDeviceListChange,
    onDeviceSelectError,
    exactMatch,
    track,
    requestPermissions,
    onError,
    ...props
  }: MediaDeviceSelectProps,
  ref,
) {
  const room = useMaybeRoomContext();
  const handleError = React.useCallback(
    (e: Error) => {
      if (room) {
        // awkwardly emit the event from outside of the room, as we don't have other means to raise a MediaDeviceError
        room.emit(RoomEvent.MediaDevicesError, e);
      }
      onError?.(e);
    },
    [room, onError],
  );
  const { devices, activeDeviceId, setActiveMediaDevice, className } = useMediaDeviceSelect({
    kind,
    room,
    track,
    requestPermissions,
    onError: handleError,
  });

  React.useEffect(() => {
    if (initialSelection !== undefined) {
      setActiveMediaDevice(initialSelection);
    }
  }, [setActiveMediaDevice]);

  React.useEffect(() => {
    if (typeof onDeviceListChange === 'function') {
      onDeviceListChange(devices);
    }
  }, [onDeviceListChange, devices]);

  React.useEffect(() => {
    console.log({ kind, activeDeviceId });

    if (activeDeviceId && activeDeviceId !== '') {
      onActiveDeviceChange?.(activeDeviceId);
    }
  }, [activeDeviceId]);


  // ********************** Changes made to fix the bug of microphone not changing on selection ********************** //

  // ********************** Old Code ********************** //
  // const handleActiveDeviceChange = async (deviceId: string) => {
  //   try {
  //     await setActiveMediaDevice(deviceId, { exact: exactMatch });
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       onDeviceSelectError?.(e);
  //     } else {
  //       throw e;
  //     }
  //   }
  // };


  // ********************** New Code ********************** //
  const handleActiveDeviceChange = async (deviceId: string) =>  {

    try {
      // For audio input devices, disconnect and restart the track only if enabled
      if (kind === 'audioinput' && room) {
        // Store the current microphone state before switching
        const wasMicrophoneEnabled = room.localParticipant.isMicrophoneEnabled;
        const currentAudioTrack = room.localParticipant.getTrackPublication(
          Track.Source.Microphone,
        )?.track as LocalAudioTrack | undefined;

        // Only disconnect/restart if microphone was enabled
        if (wasMicrophoneEnabled && currentAudioTrack) {
          // Disable microphone to unpublish the current track
          await room.localParticipant.setMicrophoneEnabled(false);

          // Small delay to ensure cleanup
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Switch to the new device
          await setActiveMediaDevice(deviceId, { exact: exactMatch });

          // Re-enable microphone with the new device
          await room.localParticipant.setMicrophoneEnabled(true);
        } else {
          // Microphone was disabled, just switch the device without enabling
          await setActiveMediaDevice(deviceId, { exact: exactMatch });

          // Ensure microphone stays disabled (in case switchActiveDevice enabled it)
          if (room.localParticipant.isMicrophoneEnabled) {
            await room.localParticipant.setMicrophoneEnabled(false);
          }
        }
      } else {
        // For other device types, use the standard switch
        await setActiveMediaDevice(deviceId, { exact: exactMatch });
      }
    } catch (e) {
      if (e instanceof Error) {
        onDeviceSelectError?.(e);
      } else {
        throw e;
      }
    }
  };


  // Merge Props
  const mergedProps = React.useMemo(
    () => mergeProps(props, { className }, { className: 'lk-list' }),
    [className, props],
  );

  function isActive(deviceId: string, activeDeviceId: string, index: number) {
    return deviceId === activeDeviceId || (index === 0 && activeDeviceId === 'default');
  }

  return (
    <ul ref={ref} {...mergedProps}>
      {devices.map((device, index) => (
        <li
          key={device.deviceId}
          id={device.deviceId}
          data-lk-active={isActive(device.deviceId, activeDeviceId, index)}
          aria-selected={isActive(device.deviceId, activeDeviceId, index)}
          role="option"
        >
          <button className="lk-button" onClick={() => handleActiveDeviceChange(device.deviceId)}>
            {device.label}
          </button>
        </li>
      ))}
    </ul>
  );
});
