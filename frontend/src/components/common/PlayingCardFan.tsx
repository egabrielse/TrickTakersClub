import { ReactElement, useEffect } from "react";
import { DEFAULT_CARD_HEIGHT } from "../../constants/card";
import { PlayingCardProps } from "./PlayingCard";
import "./PlayingCardFan.scss";

type PlayingCardFanProps = {
  id: string;
  children: Array<ReactElement<PlayingCardProps>>;
  style?: React.CSSProperties;
};

export default function PlayingCardFan({
  id,
  children,
  style,
}: PlayingCardFanProps) {
  useEffect(() => {
    const angle = 65; // Example angle, you can adjust as needed
    const count = children.length;
    const offset = angle / 2;
    const height =
      count && children[0].props.height
        ? children[0].props.height
        : DEFAULT_CARD_HEIGHT;
    const width = height / 1.5;

    children.forEach((child, index) => {
      const increment = angle / (count + 1);
      const transform = `translate(-50%, -66%) rotate(${-offset + increment * (index + 1)}deg)`;
      const element = document.getElementById(child.props.id as string);
      if (element) {
        element.style.position = "absolute";
        element.style.transform = transform;
        element.style.transformOrigin = `center ${(count + 1) * (width / 3)}px`;
      }
    });
  }, [children]);

  return (
    <div id={id} className="PlayingCardFan" style={style}>
      {children}
    </div>
  );
}
