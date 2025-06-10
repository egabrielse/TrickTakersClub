import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { DIALOG_TYPES } from "../../../constants/dialog";
import {
  BROADCAST_RECEIVER,
  EVENT_TYPES,
  MISC_TYPES,
} from "../../../constants/message";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import dialogSlice from "../../../store/slices/dialog.slice";
import gameSlice from "../../../store/slices/game.slice";
import handSlice from "../../../store/slices/hand.slice";
import sessionSlice from "../../../store/slices/session.slice";
import settingsSlice from "../../../store/slices/settings.slice";
import SessionContext from "./SessionContext";
import dealSound from "/audio/deal-cards.mp3";
import cardSound from "/audio/play-card.mp3";

export default function useMessageHandler() {
  const dispatch = useAppDispatch();
  const { getNextMessage, messageCount } = useContext(SessionContext);
  const [snackError, setSnackError] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const soundOn = useAppSelector(settingsSlice.selectors.soundOn);
  const cardSoundRef = useRef(new Audio(cardSound));
  const dealSoundRef = useRef(new Audio(dealSound));

  const playCardSound = useCallback(() => {
    if (!soundOn) return;
    cardSoundRef.current.play();
  }, [soundOn]);

  const dealCardsSound = useCallback(() => {
    if (!soundOn) return;
    dealSoundRef.current.play();
  }, [soundOn]);

  const clearSnackError = useCallback(() => setSnackError(""), []);

  useEffect(() => {
    const message = getNextMessage();
    if (message) {
      switch (message.messageType) {
        case EVENT_TYPES.WELCOME: {
          dispatch(sessionSlice.actions.welcome(message.data));
          dispatch(gameSlice.actions.welcome(message.data));
          dispatch(handSlice.actions.welcome(message.data));
          setConnected(true);
          break;
        }
        case EVENT_TYPES.ENTERED: {
          dispatch(sessionSlice.actions.playerEntered(message.data));
          break;
        }
        case EVENT_TYPES.LEFT: {
          dispatch(sessionSlice.actions.playerLeft(message.data));
          break;
        }
        case MISC_TYPES.CHAT: {
          message;
          dispatch(sessionSlice.actions.pushChatMessage(message));
          break;
        }
        case EVENT_TYPES.SETTINGS_UPDATED: {
          dispatch(sessionSlice.actions.settingsUpdated(message.data));
          break;
        }
        case EVENT_TYPES.GAME_ON: {
          dispatch(gameSlice.actions.gameOn(message.data));
          break;
        }
        case EVENT_TYPES.GAME_OVER: {
          const { scoreboard } = message.data;
          if (scoreboard.handsPlayed > 0) {
            // If at least one hand has been played, show the final scoreboard
            dispatch(
              dialogSlice.actions.openDialog({
                type: DIALOG_TYPES.GAME_SUMMARY,
                props: { scoreboard },
              }),
            );
          }
          dispatch(handSlice.actions.reset());
          dispatch(gameSlice.actions.reset());
          break;
        }
        case EVENT_TYPES.DEAL_HAND: {
          dealCardsSound();
          dispatch(handSlice.actions.dealHand(message.data));
          break;
        }
        case EVENT_TYPES.NEW_TRICK: {
          setTimeout(() => {
            dispatch(handSlice.actions.startNewTrick(message.data));
          }, 1000);
          break;
        }
        case EVENT_TYPES.UP_NEXT: {
          dispatch(handSlice.actions.upNext(message.data));
          break;
        }
        case EVENT_TYPES.BLIND_PICKED: {
          dispatch(handSlice.actions.blindPicked(message.data));
          dispatch(handSlice.actions.displayMessage({ ...message }));
          break;
        }
        case EVENT_TYPES.PICKED_CARDS: {
          dispatch(handSlice.actions.pickedCards(message.data));
          break;
        }
        case EVENT_TYPES.BURIED_CARDS: {
          playCardSound();
          dispatch(handSlice.actions.buriedCards(message.data));
          break;
        }
        case EVENT_TYPES.CALLED_CARD:
          dispatch(handSlice.actions.calledCard(message.data));
          dispatch(handSlice.actions.displayMessage({ ...message }));
          break;
        case EVENT_TYPES.GONE_ALONE:
          if (!message.data.forced) {
            // Only display the message if the player chose to go alone
            // Otherwise the picker probably wants this to remain a secret
            dispatch(handSlice.actions.displayMessage({ ...message }));
            dispatch(handSlice.actions.goneAlone());
          }
          break;
        case EVENT_TYPES.NO_PICK_HAND: {
          dispatch(handSlice.actions.displayMessage({ ...message }));
          dispatch(handSlice.actions.noPickHand());
          break;
        }
        case EVENT_TYPES.CARD_PLAYED: {
          playCardSound();
          dispatch(handSlice.actions.cardPlayed(message.data));
          dispatch(handSlice.actions.displayMessage({ ...message }));
          break;
        }
        case EVENT_TYPES.PARTNER_REVEALED: {
          dispatch(handSlice.actions.partnerRevealed(message.data));
          dispatch(handSlice.actions.displayMessage({ ...message }));
          break;
        }
        case EVENT_TYPES.TRICK_WON:
          dispatch(handSlice.actions.displayMessage({ ...message }));
          break;
        case EVENT_TYPES.HAND_DONE: {
          const { scoreboard, summary } = message.data;
          dispatch(gameSlice.actions.handDone(message.data));
          // Delay opening summary, to allow players to see the last trick
          // TODO: there's an opportunity to build a better delay system. Maybe
          // a queue of delayed actions that can be executed. Delay length
          // depends on the type of message /  the message's content.
          setTimeout(() => {
            dispatch(
              dialogSlice.actions.openDialog({
                type: DIALOG_TYPES.HAND_SUMMARY,
                props: { scoreboard, summary },
              }),
            );
          }, 1000);

          break;
        }
        case EVENT_TYPES.LAST_HAND: {
          dispatch(handSlice.actions.lastHand());
          dispatch(handSlice.actions.displayMessage({ ...message }));
          break;
        }
        case EVENT_TYPES.ERROR:
          if (message.receiverId === BROADCAST_RECEIVER) {
            dispatch(
              dialogSlice.actions.openDialog({
                type: DIALOG_TYPES.ERROR,
                props: {
                  title: "Unexpected Error",
                  message:
                    "An unexpected error occurred. Please try refreshing the page.",
                },
                closeable: false,
              }),
            );
          } else {
            setSnackError(message.data.message);
          }
          break;
        case EVENT_TYPES.TIMEOUT: {
          dispatch(
            dialogSlice.actions.openDialog({
              type: DIALOG_TYPES.ERROR,
              props: {
                title: "Timed Out",
                message: "The session was inactive for too long.",
              },
              closeable: false,
            }),
          );
          break;
        }
        default: {
          console.warn(
            `Unhandled message type: ${message.messageType} with data:`,
            message.data,
          );
        }
      }
    }
  }, [dealCardsSound, dispatch, getNextMessage, messageCount, playCardSound]);

  return { snackError, connected, clearSnackError };
}
