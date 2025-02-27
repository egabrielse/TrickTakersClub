import { useCallback, useContext, useEffect, useState } from "react";
import { HAND_PHASE } from "../../../../constants/game";
import { COMMAND_TYPES } from "../../../../constants/message";
import { useAppSelector } from "../../../../store/hooks";
import selectors from "../../../../store/selectors";
import handSlice from "../../../../store/slices/hand.slice";
import { PlayingCard } from "../../../../types/card";
import { handContainsCard } from "../../../../utils/card";
import Card from "../../../common/Card";
import CardFan from "../../../common/CardFan";
import ConnectionContext from "../ConnectionContext";

export default function PlayerHand() {
  const { sendCommand } = useContext(ConnectionContext);
  const isUpNext = useAppSelector(selectors.isUpNext);
  const phase = useAppSelector(handSlice.selectors.phase);
  const playableCards = useAppSelector(selectors.playableCards);
  const blindSize = useAppSelector(handSlice.selectors.blindSize);
  const hand = useAppSelector(handSlice.selectors.hand);
  const [selected, setSelected] = useState<PlayingCard[]>([]);

  useEffect(() => {
    // Clear selected cards after every turn
    setSelected([]);
  }, [isUpNext, phase, hand.length]);

  /**
   * Click a card to select or deselect it.
   */
  const clickCard = useCallback(
    (card: PlayingCard) => {
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
    (card: PlayingCard) => {
      if (!isUpNext) {
        return false;
      } else if (phase === HAND_PHASE.BURY) {
        return selected.includes(card) || selected.length < blindSize;
      } else if (phase === HAND_PHASE.PLAY) {
        return (
          selected.includes(card) ||
          (handContainsCard(playableCards, card) && selected.length < 1)
        );
      }
      return false;
    },
    [isUpNext, phase, selected, blindSize, playableCards],
  );

  useEffect(() => {
    if (phase === HAND_PHASE.PLAY && selected.length === 1) {
      sendCommand({
        name: COMMAND_TYPES.PLAY_CARD,
        data: { card: selected[0] },
      });
    } else if (phase === HAND_PHASE.BURY && selected.length === blindSize) {
      sendCommand({ name: COMMAND_TYPES.BURY, data: { cards: selected } });
    }
  }, [blindSize, phase, selected, sendCommand]);

  if (hand.length === 0) {
    return null;
  }
  return (
    <CardFan id="player-hand" style={{ top: "100%", left: "50%" }}>
      {hand.map((card) => (
        <Card
          id={`card-${card.suit}-${card.rank}`}
          key={`card-${card.suit}-${card.rank}`}
          card={card}
          size="large"
          highlighted={selected.includes(card)}
          disabled={!canClickCard(card)}
          onClick={canClickCard(card) ? () => clickCard(card) : undefined}
        />
      ))}
    </CardFan>
  );
}
