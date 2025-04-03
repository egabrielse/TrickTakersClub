import { useCallback, useContext, useEffect, useState } from "react";
import { HAND_PHASE } from "../../../../constants/game";
import { COMMAND_TYPES } from "../../../../constants/message";
import { useAppSelector } from "../../../../store/hooks";
import {
  selectIsUpNext,
  selectPlayableCards,
} from "../../../../store/selectors";
import handSlice from "../../../../store/slices/hand.slice";
import { Card } from "../../../../types/card";
import {
  BuryCommand,
  PlayCardCommand,
} from "../../../../types/message/command";
import { hasCard } from "../../../../utils/card";
import PlayingCard from "../../../common/PlayingCard";
import PlayingCardFan from "../../../common/PlayingCardFan";
import ConnectionContext from "../ConnectionContext";

export default function PlayerHand() {
  const { sendCommand } = useContext(ConnectionContext);
  const isUpNext = useAppSelector(selectIsUpNext);
  const phase = useAppSelector(handSlice.selectors.phase);
  const playableCards = useAppSelector(selectPlayableCards);
  const hand = useAppSelector(handSlice.selectors.hand);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [pending, setPending] = useState(false);

  /**
   * Submit a command to the server.
   * @param command The command to send.
   */
  const submitCommand = useCallback(
    (command: PlayCardCommand | BuryCommand) => {
      setPending(true);
      sendCommand(command);
      setTimeout(() => setPending(false), 1500);
    },
    [sendCommand],
  );

  /**
   * Click a card to select or deselect it.
   */
  const clickCard = useCallback(
    (card: Card) => {
      if (phase === HAND_PHASE.PLAY) {
        submitCommand({
          name: COMMAND_TYPES.PLAY_CARD,
          data: { card },
        });
      } else if (phase === HAND_PHASE.BURY) {
        if (selectedCard === null) {
          // Select first card to bury
          setSelectedCard(card);
        } else if (selectedCard === card) {
          // Unselected the selected card
          setSelectedCard(null);
        } else {
          submitCommand({
            name: COMMAND_TYPES.BURY,
            data: { cards: [selectedCard, card] },
          });
        }
      }
    },
    [phase, selectedCard, submitCommand],
  );

  /**
   * Check if the card can be clicked.
   */
  const canClickCard = useCallback(
    (card: Card) => {
      if (!isUpNext || pending || hand.length === 1) {
        return false;
      } else if (phase === HAND_PHASE.BURY) {
        return true;
      } else if (phase === HAND_PHASE.PLAY) {
        return hasCard(playableCards, card);
      }
      return false;
    },
    [isUpNext, pending, hand.length, phase, playableCards],
  );

  useEffect(() => {
    if (isUpNext && hand.length === 1 && !pending) {
      // Automatically submit the last card if it's the only one left
      const lastCard = hand[0];
      setTimeout(() => {
        submitCommand({
          name: COMMAND_TYPES.PLAY_CARD,
          data: { card: lastCard },
        });
      }, 500);
    }
  }, [hand, isUpNext, pending, submitCommand]);

  if (hand.length === 0) {
    return null;
  }
  return (
    <PlayingCardFan id="player-hand" style={{ top: "105%", left: "50%" }}>
      {hand.map((card) => (
        <PlayingCard
          id={`card-${card.suit}-${card.rank}`}
          key={`card-${card.suit}-${card.rank}`}
          card={card}
          height={250}
          highlighted={selectedCard === card}
          disabled={!canClickCard(card)}
          onClick={canClickCard(card) ? () => clickCard(card) : undefined}
        />
      ))}
    </PlayingCardFan>
  );
}
