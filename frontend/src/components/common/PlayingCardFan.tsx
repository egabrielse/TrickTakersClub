import { ReactElement, useEffect } from "react";
import { PlayingCardProps } from "./PlayingCard";
import "./PlayingCardFan.scss";

type PlayingCardFanProps = {
  id: string;
  children: Array<ReactElement<PlayingCardProps>>;
  scale?: number;
  style?: React.CSSProperties;
};

export default function PlayingCardFan({
  id,
  children,
  style,
  scale = 1,
}: PlayingCardFanProps) {
  useEffect(() => {
    const angle = 65; // Example angle, you can adjust as needed
    const count = children.length;
    const offset = angle / 2;

    children.forEach((child, index) => {
      const increment = angle / (count + 1);
      const transform = `translate(-50%, -${scale * 80}%) rotate(${-offset + increment * (index + 1)}deg)`;
      const element = document.getElementById(child.props.id as string);
      if (element) {
        element.style.position = "absolute";
        element.style.transform = transform;
        element.style.transformOrigin = `center ${(children.length + 1) * (scale * 60)}px`;
      }
    });
  }, [children, scale]);

  return (
    <div id={id} className="PlayingCardFan" style={style}>
      {children}
    </div>
  );
}
