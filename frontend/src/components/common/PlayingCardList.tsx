import { ReactElement, useEffect } from "react";
import { DEFAULT_CARD_HEIGHT } from "../../constants/card";
import { PlayingCardProps } from "./PlayingCard";
import "./PlayingCardList.scss";

type PlayingCardListProps = {
  children: Array<ReactElement<PlayingCardProps>>;
  orientation?: "horizontal" | "vertical";
};

export default function PlayingCardList({
  children,
  orientation = "horizontal",
}: PlayingCardListProps) {
  const count = children.length;
  const height =
    count && children[0].props.height
      ? children[0].props.height
      : DEFAULT_CARD_HEIGHT;
  const width = height / 1.5;
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
      className="PlayingCardList"
      style={{ height: totalHeight, width: totalWidth }}
    >
      {children}
    </div>
  );
}
