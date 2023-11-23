---
{
  "title": "useTrackByName",
  "linkToSource": "https://github.com/livekit/components-js/blob/main/packages/react/src/hooks/useTrackByName.ts"
}
---

<!-- Do not edit this file. It is automatically generated by API Documenter. -->

# useTrackByName

## Import

```typescript
import { useTrackByName } from "@livekit/components-react";
```

{% partial file="p_usage.md" variables={exampleCount: 0} /%}

## Properties

{% parameter name="options" type="UseMediaTrackOptions" optional=true %}
{% /parameter %}

{% parameter name="trackRef" type="TrackReferenceOrPlaceholder" optional=true %}
{% /parameter %}

## Returns

```typescript
{
  publication: import("livekit-client").TrackPublication | undefined;
  isMuted: boolean | undefined;
  isSubscribed: boolean | undefined;
  track: import("livekit-client").Track | undefined;
  elementProps: import("react").HTMLAttributes<HTMLElement>;
}
```