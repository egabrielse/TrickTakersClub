import { Button, ButtonProps } from "@mui/material";
import "./PaperButton.scss";

export default function PaperButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className={`PaperButton ${props.className}`}
      variant="contained"
      size="large"
    />
  );
}
