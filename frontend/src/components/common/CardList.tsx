import { ReactElement, useEffect } from "react";
import { cardSizeToPixels } from "../../utils/card";
import "./CardList.scss";
import { PlayingCardProps } from "./PlayingCard";

type CardListProps = {
  children: Array<ReactElement<PlayingCardProps>>;
  orientation?: "horizontal" | "vertical";
};

export default function CardList({
  children,
  orientation = "horizontal",
}: CardListProps) {
  const count = children.length;
  const cardSize = children.length ? children[0].props.size : "medium";
  const { width, height } = cardSizeToPixels(cardSize);
  const isHorizontal = orientation === "horizontal";
  const totalHeight = isHorizontal ? height : (height / 4) * (count + 3);
  const totalWidth = isHorizontal ? (width / 2) * (count + 1) : width;

  useEffect(() => {
    if (children.length === 0) {
      // No cards to lay out
      return;
    } else if (isHorizontal) {
      // Cards are laid out horizontally
      children.forEach((card, index) => {
        const cardElement = document.getElementById(card.props.id);
        if (cardElement) {
          cardElement.style.transform = `translateX(${index * (width / 2)}px)`;
        }
      });
    } else {
      // Cards are stacked vertically
      children.forEach((card, index) => {
        const cardElement = document.getElementById(card.props.id);
        if (cardElement) {
          cardElement.style.transform = `translateY(${index * (height / 4)}px)`;
        }
      });
    }
  }, [children, height, isHorizontal, width]);

  return (
    <div
      className="CardList"
      style={{ height: totalHeight, width: totalWidth }}
    >
      {children}
    </div>
  );
}
