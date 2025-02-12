import { Box } from "@mui/material";
import classNames from "classnames";
import { CardSize, PlayingCard } from "../../types/card";
import { cardSizeToPixels, getCardBack, getCardFace } from "../../utils/card";
import "./Card.scss";

export type CardProps = {
  id: string;
  card: PlayingCard | "back" | "empty";
  size?: CardSize;
  highlighted?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  overlayText?: string;
};

export default function Card(props: CardProps) {
  const {
    id,
    card,
    size = "medium",
    highlighted = false,
    disabled = false,
    onClick,
    overlayText,
  } = props;
  const { width, height } = cardSizeToPixels(size);
  const overlayWidth = width / 1.25;
  const overlayTextSize =
    size === "large" ? "2rem" : size === "small" ? "1.25rem" : "1.5rem";

  const getCardImage = (card: PlayingCard | "back" | "empty") => {
    if (card === "empty") {
      return undefined;
    } else if (card === "back") {
      return getCardBack();
    } else {
      return getCardFace(card);
    }
  };

  return (
    <div
      id={id}
      onClick={onClick}
      style={{ height, width }}
      className={classNames("CardContainer", {
        interactive: onClick !== undefined,
        highlighted: highlighted,
        disabled: disabled,
      })}
    >
      <Box
        className="Card"
        component={card === "empty" ? "div" : "img"}
        sx={{ height, width }}
        src={getCardImage(card)}
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
