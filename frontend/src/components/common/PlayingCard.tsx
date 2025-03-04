import { Box } from "@mui/material";
import classNames from "classnames";
import { DEFAULT_CARD_HEIGHT } from "../../constants/card";
import { Card } from "../../types/card";
import { getCardBack, getCardFace } from "../../utils/card";
import "./PlayingCard.scss";

export type PlayingCardProps = {
  id: string;
  card: Card | "back";
  height?: number;
  highlighted?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  overlayText?: string;
};

export default function PlayingCard({
  id,
  card,
  height = DEFAULT_CARD_HEIGHT,
  highlighted = false,
  disabled = false,
  onClick,
}: PlayingCardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      style={{
        height,
        width: height / 1.5,
      }}
      className={classNames("CardContainer", {
        interactive: onClick !== undefined,
        highlighted: highlighted,
        disabled: disabled,
      })}
    >
      <Box
        className="PlayingCard"
        component="img"
        sx={{
          height,
          width: height / 1.5,
        }}
        src={card === "back" ? getCardBack() : getCardFace(card)}
      />
    </div>
  );
}
