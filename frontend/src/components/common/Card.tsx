import { Box } from "@mui/material";
import { DEFAULT_CARD_BACK } from "../../constants/game";
import { CardSize, PlayingCard } from "../../types/game";
import { cardSizeToPixels, getCardBack, getCardFace } from "../../utils/game";
import "./Card.scss";

type CardProps = {
  id: string;
  card?: PlayingCard;
  size?: CardSize;
  selected?: boolean;
  onClick?: () => void;
  xOverlap?: boolean;
  yOverlap?: boolean;
  overlayText?: string;
};

export default function Card(props: CardProps) {
  const {
    id,
    card,
    size = "medium",
    selected = false,
    onClick,
    xOverlap = false,
    yOverlap = false,
    overlayText,
  } = props;
  const { width, height } = cardSizeToPixels(size);
  const overlayWidth = width / 1.25;
  const overlayTextSize =
    size === "large" ? "2rem" : size === "small" ? "1.25rem" : "1.5rem";
  const selectable = onClick !== undefined;

  return (
    <div
      id={id}
      className={`CardContainer ${
        selected ? "selected" : selectable ? "selectable" : ""
      }`}
      onClick={onClick}
      style={{
        height: yOverlap ? height / 3 : height,
        width: xOverlap ? width / 2 : width,
      }}
    >
      <Box
        className="Card"
        component={card === undefined ? "div" : "img"}
        sx={{ height, width }}
        src={card ? getCardFace(card) : getCardBack(DEFAULT_CARD_BACK)}
      />
      {overlayText && (
        <div
          className="OverlayText"
          style={{
            height: overlayWidth,
            width: overlayWidth,
            left: (width - overlayWidth) / 2,
            top: (height - overlayWidth) / 2,
            fontSize: overlayTextSize,
          }}
        >
          {overlayText}
        </div>
      )}
    </div>
  );
}
