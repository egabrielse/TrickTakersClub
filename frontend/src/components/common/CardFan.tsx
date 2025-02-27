import { CardProps } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import "./CardFan.scss";

type CardFanProps = {
  children: Array<ReactElement<CardProps>>;
  baseZIndex?: number;
};

export default function CardFan({ children, baseZIndex }: CardFanProps) {
  const [prevChildren, setPrevChildren] = useState(
    children.map((child) => child.props.id),
  );

  useEffect(() => {
    const angle = 65; // Example angle, you can adjust as needed
    const count = children.length;
    const offset = angle / 2;

    children.forEach((child, index) => {
      const increment = angle / (count + 1);
      const transform = `translate(-50%, 20%) rotate(${-offset + increment * (index + 1)}deg)`;
      const element = document.getElementById(child.props.id as string);
      if (element) {
        element.style.position = "absolute";
        element.style.left = "50%";
        element.style.bottom = "0px";
        element.style.transform = transform;
        element.style.transformOrigin = `center ${(children.length + 1) * 75}px`;
        if (baseZIndex) {
          element.style.zIndex = String(baseZIndex + index);
        }
        if (!prevChildren.includes(child.props.id)) {
          // Flash newly added cards
          element?.animate([{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], {
            duration: 500,
            easing: "ease-in-out",
            fill: "forwards",
          });
          setPrevChildren((prev) => [...prev, child.props.id]);
        }
      }
    });
  }, [baseZIndex, children, prevChildren]);

  return children;
}
