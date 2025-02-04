import { useContext } from "react";
import {
  cardSizeToPixels,
  compareCards,
  handContainsCard,
} from "../../../../../utils/card";
import Card from "../../../../common/Card";
import CardFan from "../../../../common/CardFan";
import { TableState } from "../../TableStateProvider";
import Bury from "./Bury";
import "./PlayerSeat.scss";
import RoleChip from "./RoleChip";
import TrickPile from "./TrickPile";

export default function PlayerSeat({ playerId }: { playerId: string }) {
  const { dealerId, pickerId, partnerId, calledCard, hand } =
    useContext(TableState);
  const isDealer = dealerId === playerId;
  const isPicker = pickerId === playerId;
  const isPartner =
    partnerId === playerId ||
    (calledCard && handContainsCard(hand, calledCard));
  const { width } = cardSizeToPixels("large");
  const handWidth = Math.min((hand.length * width) / 2, 300);
  const sortedHand = [...hand].sort(compareCards);

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
          {sortedHand.map((card, index) => (
            <Card
              id={`${playerId}-${card.rank}-${card.suit}`}
              key={index}
              card={card}
              size="large"
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
