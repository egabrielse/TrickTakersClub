import { useContext } from "react";
import { handContainsCard } from "../../../../../utils/card";
import CardList from "../../../../common/CardList";
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
        <CardList cardSize="large" overlap cards={hand} />
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
