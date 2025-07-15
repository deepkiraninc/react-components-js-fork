import React, { useCallback, useEffect, useRef, useState } from "react";

export interface FullscreenProps {
    elementId: string;
    parentCallback: () => void;
}

export function FullscreenIndicator({ elementId, parentCallback }: FullscreenProps) {
    const isEventListenerConnected = useRef(false);
    const [isFullScreen, setFullScreen] = useState(false);


    const getFullScreenElement = (() => {
        if (document.fullscreenEnabled) {
            return document.fullscreenElement;
        } else {
            return;
        }
    });

    const hasEvent = ((contentElement: any, eventName: string) => {
        for (const key in contentElement) {
            if (eventName === key) {
                return true;
            }
        }
        return false;
    });

    const getFullScreenChangeEvent = ((contentElement: any) => {
        if (document.fullscreenEnabled && hasEvent(contentElement, 'onfullscreenchange')) {
            return 'fullscreenchange';
        } else if (document.fullscreenEnabled && hasEvent(contentElement, 'onwebkitfullscreenchange')) {
            return 'webkitfullscreenchange';
        } else if (document.fullscreenEnabled && hasEvent(contentElement, 'onmozfullscreenchange')) {
            return 'mozfullscreenchange';
        } else if (document.fullscreenEnabled && hasEvent(contentElement, 'onmsfullscreenchange')) {
            return 'msfullscreenchange';
        } else {
            return;
        }
    });

    const getFullScreenCancelMethod = (() => {
        if (document.fullscreenEnabled && document.exitFullscreen) {
            return document.exitFullscreen;
        } else if (document.fullscreenEnabled && document.exitFullscreen) {
            return document.exitFullscreen;
        } else if (document.fullscreenEnabled && document.exitFullscreen) {
            return document.exitFullscreen;
        } else {
            return;
        }
    });

    const getFullScreenRequestMethod = ((contentElement: any) => {
        if (document.fullscreenEnabled && contentElement.requestFullscreen) {
            return contentElement.requestFullscreen;
        } else if (document.fullscreenEnabled && contentElement.webkitRequestFullscreen) {
            return contentElement.webkitRequestFullscreen;
        } else if (document.fullscreenEnabled && contentElement.mozRequestFullScreen) {
            return contentElement.mozRequestFullScreen;
        } else if (document.fullscreenEnabled && contentElement.msRequestFullscreen) {
            return contentElement.msRequestFullscreen;
        } else {
            return;
        }
    });

    const fullScreenChangeListener = ((setFullScreen: (arg0: boolean) => void) => {
        const isFullScreenActive = getFullScreenElement() != null;
        setFullScreen(isFullScreenActive);
    });

    useEffect(() => {
        if (!isEventListenerConnected.current) {
            let contentElement = document.getElementById('app');
            if (contentElement) {

                let eventName = getFullScreenChangeEvent(contentElement);
                if (eventName) {
                    contentElement.addEventListener(eventName, () => fullScreenChangeListener(setFullScreen));
                }

                isEventListenerConnected.current = true;
            }
        }
    }, [isEventListenerConnected, setFullScreen]);

    const toggleFullScreen = useCallback(() => {
        if (isFullScreen) {
            const requestMethod = getFullScreenCancelMethod();
            if (requestMethod) {
                requestMethod.call(document);
                setFullScreen(false);
            }
        } else {
            const contentElement = document.getElementById(elementId);
            const requestMethod = getFullScreenRequestMethod(contentElement);
            if (requestMethod) {
                requestMethod.call(contentElement);
                setFullScreen(true);
            }
        }
        parentCallback();
    }, [isFullScreen]);

    return (
        <button className="tl-blur lk-button" onClick={toggleFullScreen}>
            {isFullScreen ? 'Exit' : 'Enter'} FullScreen
        </button>
    )
}