import { useMemo } from "react";
import { PlayingCard } from "../../types/game";
import {
  cardSizeToPixels,
  compareCards,
  getCardPoints,
} from "../../utils/game";
import Card from "./Card";
import "./CardList.scss";

type CardListProps = {
  cards: (PlayingCard | undefined)[];
  cardSize?: "small" | "medium" | "large";
  displayPoints?: boolean;
  overlap?: boolean;
};

export default function CardList({
  cards,
  cardSize = "medium",
  displayPoints,
  overlap = false,
}: CardListProps) {
  const cardCount = cards.length;
  const sortedCards = [...cards].sort(compareCards);
  const calculatedWidth = useMemo(() => {
    const { width } = cardSizeToPixels(cardSize);
    return overlap ? width + (cardCount - 1) * (width / 2) : undefined;
  }, [cardSize, cardCount, overlap]);

  return (
    <div className="CardList" style={{ width: calculatedWidth }}>
      {sortedCards.map((card, index) => (
        <Card
          id={`card-list-${index}`}
          key={index}
          card={card}
          size={cardSize}
          xOverlap={overlap}
          overlayText={
            displayPoints && card ? `${getCardPoints(card)}pt` : undefined
          }
        />
      ))}
    </div>
  );
}
