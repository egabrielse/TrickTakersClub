import { useEffect } from "react";
import { useAppSelector } from "../../../../store/hooks";
import selectors from "../../../../store/selectors";
import PlayingCard from "../../../common/PlayingCard";

type OpponentTrickPileProps = {
  playerId: string;
  position: "left" | "right" | "top-left" | "top-right";
};

export default function OpponentTrickPile({
  playerId,
  position,
}: OpponentTrickPileProps) {
  const talliedTricks = useAppSelector(selectors.tallyCompletedTricks);
  const tricksWon = talliedTricks[playerId]?.[0];

  useEffect(() => {
    const element = document.getElementById(`trick-pile-${playerId}`);
    if (element) {
      switch (position) {
        case "left":
          element.style.left = "0px";
          element.style.top = "calc(50% + 150px)";
          element.style.rotate = "270deg";
          element.style.translate = "-50% -50%";
          break;
        case "top-left":
          element.style.left = "calc(33% - 150px)";
          element.style.top = "0px";
          element.style.rotate = "360deg";
          element.style.translate = "-50% -50%";
          break;
        case "top-right":
          element.style.right = "calc(33% - 150px)";
          element.style.top = "0px";
          element.style.rotate = "360deg";
          element.style.translate = "50% -50%";
          break;
        case "right":
          element.style.right = "0px";
          element.style.top = "calc(50% + 150px)";
          element.style.rotate = "90deg";
          element.style.translate = "50% -50%";
          break;
        default:
          break;
      }
    }
  }, [playerId, position, tricksWon]);

  if (tricksWon === 0 || tricksWon === undefined) {
    return null;
  }
  return (
    <div id={`trick-pile-${playerId}`} style={{ position: "absolute" }}>
      <PlayingCard
        id={`trick-pile-${playerId}-card`}
        card={"back"}
        disabled
        height={100}
      />
      <span
        style={{
          position: "absolute",
          translate: "-50% -25%",
          top: "50%",
          left: "50%",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.5rem",
        }}
      >
        X{tricksWon}
      </span>
    </div>
  );
}
