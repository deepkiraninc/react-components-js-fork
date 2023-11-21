---
{
  "title": "UseMediaDeviceSelectProps interface",
  "linkToSource": "https://github.com/livekit/components-js/blob/main/packages/react/src/hooks/useMediaDeviceSelect.ts"
}
---

<!-- Do not edit this file. It is automatically generated by API Documenter. -->

# UseMediaDeviceSelectProps interface

**Signature:**

```typescript
export interface UseMediaDeviceSelectProps
```

{% partial file="p_usage.md" variables={exampleCount: 0} /%}

## Properties

| Property                                                                       | Type                               | Description                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [kind](./react/usemediadeviceselectprops.kind.md)                              | MediaDeviceKind                    |                                                                                                                                                                                                                                                                                                                                                          |
| [requestPermissions?](./react/usemediadeviceselectprops.requestpermissions.md) | boolean                            | _(Optional)_ this will call getUserMedia if the permissions are not yet given to enumerate the devices with device labels. in some browsers multiple calls to getUserMedia result in multiple permission prompts. It's generally advised only flip this to true, once a (preview) track has been acquired successfully with the appropriate permissions. |
| [room?](./react/usemediadeviceselectprops.room.md)                             | Room                               | _(Optional)_                                                                                                                                                                                                                                                                                                                                             |
| [track?](./react/usemediadeviceselectprops.track.md)                           | LocalAudioTrack \| LocalVideoTrack | _(Optional)_                                                                                                                                                                                                                                                                                                                                             |