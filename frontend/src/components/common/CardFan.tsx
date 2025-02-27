import { CardProps } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import "./CardFan.scss";

type CardFanProps = {
  id: string;
  children: Array<ReactElement<CardProps>>;
  scale?: number;
  style?: React.CSSProperties;
};

export default function CardFan({
  id,
  children,
  style,
  scale = 1,
}: CardFanProps) {
  const [prevChildren, setPrevChildren] = useState(
    children.map((child) => child.props.id),
  );

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
        if (!prevChildren.includes(child.props.id)) {
          // Flash newly added cards
          // TODO: doesn't look quite right. maybe try a different way of flashing (filter?)
          element?.animate([{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], {
            duration: 500,
            easing: "ease-in-out",
            fill: "forwards",
          });
          setPrevChildren((prev) => [...prev, child.props.id]);
        }
      }
    });
  }, [children, prevChildren, scale]);

  return (
    <div id={id} className="CardFan" style={style}>
      {children}
    </div>
  );
}
