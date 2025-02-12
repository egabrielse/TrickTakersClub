import { CardProps } from "@mui/material";
import { ReactElement, useCallback, useEffect } from "react";
import { useResizeDetector } from "react-resize-detector";
import "./CardFan.scss";

type CardFanProps = {
  children: Array<ReactElement<CardProps>>;
  width: number;
};

export default function CardFan({ children, width }: CardFanProps) {
  const reLayout = useCallback(() => {
    const angle = 65; // Example angle, you can adjust as needed
    const count = children.length;
    const offset = angle / 2;

    children.forEach((child, i) => {
      const increment = angle / (count + 1);
      const transform = `translate(-50%, -50%) rotate(${-offset + increment * (i + 1)}deg)`;
      const element = document.getElementById(child.props.id as string);
      if (element) {
        element.style.transform = transform;
        element.style.transformOrigin = `center ${width}%`;
      }
    });
  }, [children, width]);

  const { ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: "debounce",
    refreshRate: 250,
    onResize: reLayout,
  });

  useEffect(() => {
    // Relayout the fan whenever the number of cards changes
    reLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children.length]);

  return (
    <div ref={ref} className="CardFan" style={{ width }}>
      {children}
    </div>
  );
}
