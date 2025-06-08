import { Alert, Snackbar } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { BROADCAST_RECEIVER, MESSAGE_TYPES } from "../../../constants/message";
import { useAppDispatch } from "../../../store/hooks";
import sessionSlice from "../../../store/slices/session.slice";
import SlideTransition from "../../common/SlideTransition";
import LoadingOverlay from "../loading/LoadingOverlay";
import SessionContext from "./SessionContext";

type MessageHandlerProps = {
  children: React.ReactNode;
};
export default function MessageHandler({ children }: MessageHandlerProps) {
  const dispatch = useAppDispatch();
  const { getNextMessage, messageCount } = useContext(SessionContext);
  const [snackError, setSnackError] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);

  const clearSnackError = () => setSnackError("");

  useEffect(() => {
    const message = getNextMessage();
    if (message) {
      switch (message.messageType) {
        case MESSAGE_TYPES.WELCOME: {
          dispatch(sessionSlice.actions.welcome(message));
          setConnected(true);
          break;
        }
        case MESSAGE_TYPES.CHAT: {
          dispatch(sessionSlice.actions.pushChatMessage(message));
          break;
        }
        case MESSAGE_TYPES.ENTERED: {
          dispatch(sessionSlice.actions.playerEntered(message));
          break;
        }
        case MESSAGE_TYPES.LEFT: {
          dispatch(sessionSlice.actions.playerLeft(message));
          break;
        }
        case MESSAGE_TYPES.ERROR:
          if (message.receiverId !== BROADCAST_RECEIVER) {
            setSnackError(message.payload.message);
          }
          break;
      }
    }
  }, [dispatch, getNextMessage, messageCount]);

  if (!connected) {
    return <LoadingOverlay text="Joining session" trailingEllipsis />;
  } else {
    return (
      <>
        {children}
        <Snackbar
          open={snackError !== ""}
          onClose={clearSnackError}
          TransitionComponent={SlideTransition}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert variant="filled" severity="error" onClose={clearSnackError}>
            {snackError}
          </Alert>
        </Snackbar>
      </>
    );
  }
}
