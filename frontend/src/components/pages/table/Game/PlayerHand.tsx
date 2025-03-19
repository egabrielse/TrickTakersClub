import { useCallback, useContext, useEffect, useState } from "react";
import { BLIND_SIZE, HAND_PHASE } from "../../../../constants/game";
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
import { handContainsCard } from "../../../../utils/card";
import PlayingCard from "../../../common/PlayingCard";
import PlayingCardFan from "../../../common/PlayingCardFan";
import ConnectionContext from "../ConnectionContext";

export default function PlayerHand() {
  const { sendCommand } = useContext(ConnectionContext);
  const isUpNext = useAppSelector(selectIsUpNext);
  const phase = useAppSelector(handSlice.selectors.phase);
  const playableCards = useAppSelector(selectPlayableCards);
  const hand = useAppSelector(handSlice.selectors.hand);
  const [selected, setSelected] = useState<Card[]>([]);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    // Clear selected cards after every turn
    setSelected([]);
  }, [isUpNext, phase, hand.length]);

  /**
   * Click a card to select or deselect it.
   */
  const clickCard = useCallback(
    (card: Card) => {
      if (selected.includes(card)) {
        setSelected(selected.filter((c) => c !== card));
      } else {
        setSelected([...selected, card]);
      }
    },
    [selected],
  );

  /**
   * Check if the card can be clicked.
   */
  const canClickCard = useCallback(
    (card: Card) => {
      if (!isUpNext || pending || hand.length === 1) {
        return false;
      } else if (phase === HAND_PHASE.BURY) {
        return selected.includes(card) || selected.length < BLIND_SIZE;
      } else if (phase === HAND_PHASE.PLAY) {
        return (
          selected.includes(card) ||
          (handContainsCard(playableCards, card) && selected.length < 1)
        );
      }
      return false;
    },
    [isUpNext, pending, hand.length, phase, selected, playableCards],
  );

  const submitCommand = useCallback(
    (command: PlayCardCommand | BuryCommand) => {
      setPending(true);
      sendCommand(command);
      setTimeout(() => setPending(false), 1500);
    },
    [sendCommand],
  );

  useEffect(() => {
    if (isUpNext) {
      if (hand.length === 1) {
        // Automatically submit the last card if it's the only one left
        const lastCard = hand[0];
        setTimeout(() => {
          submitCommand({
            name: COMMAND_TYPES.PLAY_CARD,
            data: { card: lastCard },
          });
        }, 500);
      } else if (phase === HAND_PHASE.PLAY && selected.length === 1) {
        submitCommand({
          name: COMMAND_TYPES.PLAY_CARD,
          data: { card: selected[0] },
        });
      } else if (phase === HAND_PHASE.BURY && selected.length === BLIND_SIZE) {
        submitCommand({
          name: COMMAND_TYPES.BURY,
          data: { cards: selected },
        });
      }
    }
  }, [hand, isUpNext, phase, selected, sendCommand, submitCommand]);

  if (hand.length === 0) {
    return null;
  }
  return (
    <PlayingCardFan id="player-hand" style={{ top: "100%", left: "50%" }}>
      {hand.map((card) => (
        <PlayingCard
          id={`card-${card.suit}-${card.rank}`}
          key={`card-${card.suit}-${card.rank}`}
          card={card}
          height={275}
          highlighted={selected.includes(card)}
          disabled={!canClickCard(card)}
          onClick={canClickCard(card) ? () => clickCard(card) : undefined}
        />
      ))}
    </PlayingCardFan>
  );
}
