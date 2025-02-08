import { useCallback, useState } from "react";
import selectors from "../../../../../store/selectors";
import handSlice from "../../../../../store/slices/hand.slice";
import { useAppSelector } from "../../../../../store/store";
import { PlayingCard } from "../../../../../types/card";
import { cardSizeToPixels } from "../../../../../utils/card";
import Card from "../../../../common/Card";
import CardFan from "../../../../common/CardFan";
import Bury from "./Bury";
import "./PlayerSeat.scss";
import RoleChip from "./RoleChip";
import TrickPile from "./TrickPile";
// TODO: Finish this component
export default function PlayerSeat({ playerId }: { playerId: string }) {
  const isUpNext = useAppSelector(selectors.isUpNext);
  const isDealer = useAppSelector(selectors.isDealer);
  const isPicker = useAppSelector(selectors.isPicker);
  const isPartner = useAppSelector(selectors.isPartner);
  const playableCards = useAppSelector(selectors.playableCards);
  const blindSize = useAppSelector(handSlice.selectors.blindSize);
  const hand = useAppSelector(handSlice.selectors.hand);
  const { width } = cardSizeToPixels("large");
  const handWidth = Math.min((hand.length * width) / 2, 300);
  const [selected, setSelected] = useState<PlayingCard[]>([]);

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
    (card: PlayingCard) =>
      (isUpNext && // Player's turn
        selected.includes(card)) || // Card is already selected (and can be deselected)
      (playableCards.includes(card) && selected.length < blindSize), // Or the card is playable
    [isUpNext, blindSize, playableCards, selected],
  );

  //   /**
  //  * Confirm the selected cards and send the turn message.
  //  */
  //   const confirm = useCallback(() => {
  //     if (!isUpNext || selected.length !== blindSize) {
  //       return;
  //     } else if (nextTurn?.turnType === TURN_TYPE.BURY) {
  //       const payload = createBuryPayload(playerId, selected);
  //       dispatch(connSlice.actions.sendMessage(createTurnMessage(playerId, payload)));
  //     } else if (nextTurn?.turnType === TURN_TYPE.PLAY) {
  //       const payload = createPlayPayload(playerId, selected[0]);
  //       dispatch(connSlice.actions.sendMessage(createTurnMessage(playerId, payload)));
  //     }
  //   }, [dispatch, isUpNext, blindSize, nextTurn?.turnType, playerId, selected]);

  return (
    <div id={`seat-${playerId}`} className="PlayerSeat">
      <div className="PlayerSeat-Left">
        {isDealer ? (
          <RoleChip role="dealer" size="large" />
        ) : (
          // Placeholder for dealer chip
          <div style={{ height: 44 }} />
        )}
        <TrickPile playerId={playerId} />
      </div>
      <div className="PlayerSeat-Center" style={{ minWidth: handWidth }}>
        <CardFan width={handWidth}>
          {hand.map((card, index) => (
            <Card
              id={`hand-${card.suit}-${card.rank}`}
              key={index}
              card={card}
              size="large"
              selected={selected.includes(card)}
              disabled={isUpNext ? canClickCard(card) : false}
              onClick={canClickCard(card) ? () => clickCard(card) : undefined}
            />
          ))}
        </CardFan>
      </div>
      <div className="PlayerSeat-Right">
        {isPicker ? (
          <RoleChip role="picker" size="large" />
        ) : isPartner ? (
          <RoleChip role="partner" size="large" />
        ) : (
          // Placeholder for picker/partner chip
          <div style={{ height: 44 }} />
        )}
        {}
        <Bury />
      </div>
    </div>
  );
}
