import { useMemo } from "react";
import { cardSizeToPixels } from "../../utils/card";
import Card from "./Card";
import "./CardList.scss";

type CardBackListProps = {
  count: number;
  cardSize?: "small" | "medium" | "large";
  overlap?: boolean;
};

export default function CardBackList({
  count,
  cardSize = "medium",
  overlap = false,
}: CardBackListProps) {
  const calculatedWidth = useMemo(() => {
    const { width } = cardSizeToPixels(cardSize);
    return overlap ? width + (count - 1) * (width / 2) : undefined;
  }, [cardSize, count, overlap]);

  return (
    <div className="CardList" style={{ width: calculatedWidth }}>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          id={`card-list-${index}`}
          key={index}
          card="back"
          size={cardSize}
          xOverlap={overlap}
        />
      ))}
    </div>
  );
}
