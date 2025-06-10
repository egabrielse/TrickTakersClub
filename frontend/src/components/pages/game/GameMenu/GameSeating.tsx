import { Typography } from "@mui/material";
import { PLAYER_COUNT } from "../../../../constants/game";
import { useAppSelector } from "../../../../store/hooks";
import sessionSlice from "../../../../store/slices/session.slice";
import NameTag from "../OverlayComponents/NameTag";
import EmptySeat from "./EmptySeat";
import "./GameSeating.scss";
import LinkButton from "./LinkButton";

export default function GameSeating() {
  const presence = useAppSelector(sessionSlice.selectors.presence);

  const renderSeats = () => {
    const seats = [];
    for (let i = 0; i < PLAYER_COUNT; i++) {
      if (presence.length > i) {
        const uid = presence[i];
        seats.push(<NameTag key={`name-tag-${i}`} playerId={uid} />);
      } else {
        seats.push(<EmptySeat key={`empty-seat-${i}`} />);
      }
    }
    return seats;
  };

  return (
    <div className="GameSeating">
      <Typography variant="h2">Players</Typography>
      <div className="GameSeating-PlayerList">{renderSeats()}</div>
      <LinkButton />
    </div>
  );
}
