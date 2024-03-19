import { useLayoutContext, useRoomContext } from "../context";
import React from "react";

// export interface WhiteboardIndicaterProps {
//     ref: any;
// }

export function WhiteboardIndicater() {
    const room = useRoomContext();
    const { dispatch, state } = useLayoutContext().whiteboard;

    const encoder = new TextEncoder()

    const toggleWhiteboard = async () => {
        if (!room) return;

        try {
            if (state?.show_whiteboard) {
                const strData = JSON.stringify({ openWhiteboard: true })
                const data = encoder.encode(strData);

                // publish lossy data to the entire room
                room.localParticipant.publishData(data, 1)
                if (dispatch) {
                    dispatch({ msg: "show_whiteboard" })
                }
            } else {
                const strData = JSON.stringify({ openWhiteboard: false })
                const data = encoder.encode(strData);

                // publish lossy data to the entire room
                room.localParticipant.publishData(data, 1);

                if (dispatch) {
                    dispatch({ msg: "hide_whiteboard" })
                }
            }
        } catch (e: any) {
            console.log(`ERROR: ${e.message}`);
        } finally {
            console.log("Whiteboard toggle");
        }
    }

    return (
        <button className="tl-blur lk-button" onClick={toggleWhiteboard}>
            Whiteboard {state?.show_whiteboard}
        </button>
    )
}