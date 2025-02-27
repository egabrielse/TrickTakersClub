import Typography from "@mui/material/Typography";
import { useEffect, useRef } from "react";

type StyledNumberProps = {
  children: number;
};

export default function StyledNumber({ children }: StyledNumberProps) {
  const ref = useRef<HTMLDivElement>(null);
  const color = children > 0 ? "success" : children < 0 ? "error" : undefined;
  const prefix = children > 0 ? "+" : "";

  useEffect(() => {
    if (ref.current) {
      ref.current.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], {
        duration: 500,
        easing: "ease-in-out",
        fill: "forwards",
      });
    }
  }, [children]);

  return (
    <Typography ref={ref} color={color} fontWeight="bold" variant="body1">
      {prefix}
      {children}
    </Typography>
  );
}
