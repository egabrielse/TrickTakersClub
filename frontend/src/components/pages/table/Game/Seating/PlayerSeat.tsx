import { Button } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { HAND_PHASE } from "../../../../../constants/game";
import { COMMAND_TYPES } from "../../../../../constants/message";
import selectors from "../../../../../store/selectors";
import handSlice from "../../../../../store/slices/hand.slice";
import { useAppSelector } from "../../../../../store/store";
import { PlayingCard } from "../../../../../types/card";
import Card from "../../../../common/Card";
import CardList from "../../../../common/CardList";
import ConnectionContext from "../../ConnectionContext";
import Bury from "./Bury";
import "./PlayerSeat.scss";
import RoleChip from "./RoleChip";
import TrickPile from "./TrickPile";

export default function PlayerSeat({ playerId }: { playerId: string }) {
  const { sendCommand } = useContext(ConnectionContext);
  const isUpNext = useAppSelector(selectors.isUpNext);
  const isDealer = useAppSelector(selectors.isDealer);
  const isPicker = useAppSelector(selectors.isPicker);
  const isPartner = useAppSelector(selectors.isPartner);
  const phase = useAppSelector(handSlice.selectors.phase);
  const playableCards = useAppSelector(selectors.playableCards);
  const blindSize = useAppSelector(handSlice.selectors.blindSize);
  const hand = useAppSelector(handSlice.selectors.hand);
  const [selected, setSelected] = useState<PlayingCard[]>([]);

  useEffect(() => {
    // Clear selected cards when the phase changes
    setSelected([]);
  }, [isUpNext, phase]);

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
          (playableCards.includes(card) && selected.length < 1)
        );
      }
      return false;
    },
    [isUpNext, phase, selected, blindSize, playableCards],
  );

  /**
   * Bury the selected cards.
   */
  const buryCards = () => {
    if (phase === HAND_PHASE.BURY && selected.length === blindSize) {
      sendCommand({ name: COMMAND_TYPES.BURY, data: { cards: selected } });
    }
  };

  const playCard = () => {
    if (phase === HAND_PHASE.PLAY && selected.length === 1) {
      sendCommand({
        name: COMMAND_TYPES.PLAY_CARD,
        data: { card: selected[0] },
      });
    }
  };

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
      <div className="PlayerSeat-Center">
        <div className="PlayerSeat-Center-Top">
          <CardList>
            {hand.map((card, index) => (
              <Card
                id={`hand-${card.suit}-${card.rank}`}
                key={index}
                card={card}
                size="large"
                highlighted={selected.includes(card)}
                disabled={isUpNext && !canClickCard(card)}
                onClick={canClickCard(card) ? () => clickCard(card) : undefined}
              />
            ))}
          </CardList>
        </div>
        <div className="PlayerSeat-Center-Bottom">
          {isUpNext && phase === HAND_PHASE.BURY && (
            <Button
              variant="contained"
              color="primary"
              disabled={selected.length !== blindSize}
              onClick={buryCards}
            >
              Bury Cards
            </Button>
          )}
          {isUpNext && phase === HAND_PHASE.PLAY && (
            <Button
              variant="contained"
              color="primary"
              disabled={selected.length !== 1}
              onClick={playCard}
            >
              Play Card
            </Button>
          )}
        </div>
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
        <Bury />
      </div>
    </div>
  );
}
