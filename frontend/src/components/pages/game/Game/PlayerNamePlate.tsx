import { Paper } from "@mui/material";
import { useEffect } from "react";
import EmptySeat from "../OverlayComponents/EmptySeat";
import NameTag from "../OverlayComponents/NameTag";
import "./PlayerNamePlate.scss";

type PlayerNamePlateProps = {
  playerId: string;
  position: "left" | "right" | "top-left" | "top-right" | "bottom";
};

export default function PlayerNamePlate({
  playerId,
  position,
}: PlayerNamePlateProps) {
  useEffect(() => {
    const seat = document.getElementById(`name-plate-${position}`);
    if (seat) {
      seat.style.position = "absolute";
      switch (position) {
        case "bottom":
          // Player 1 (bottom)
          seat.style.left = "50%";
          seat.style.bottom = "4rem";
          seat.style.zIndex = "4";
          break;
        case "left":
          // Player 2 (left)
          seat.style.left = "0px";
          seat.style.top = "50%";
          seat.style.transform = "rotate(-90deg)";
          seat.style.zIndex = "4";
          break;
        case "top-left":
          // Player 3 (top left)
          seat.style.left = "33%";
          seat.style.top = "0px";
          seat.style.zIndex = "4";
          break;
        case "top-right":
          // Player 4 (top right)
          seat.style.right = "33%";
          seat.style.top = "0px";
          seat.style.zIndex = "4";
          break;
        case "right":
          // Player 5 (right)
          seat.style.right = "0px";
          seat.style.top = "50%";
          seat.style.transform = "rotate(90deg)";
          seat.style.zIndex = "4";
          break;
      }
    }
  }, [position, playerId]);

  return (
    <div
      key={`name-plate-${position}`}
      id={`name-plate-${position}`}
      className="PlayerNamePlate"
    >
      <Paper>
        {playerId === "" ? <EmptySeat /> : <NameTag playerId={playerId} />}
      </Paper>
    </div>
  );
}
