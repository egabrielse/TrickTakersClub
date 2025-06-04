import { Button, Typography } from "@mui/material";
import Club from "../common/icons/Club";
import Diamond from "../common/icons/Diamond";
import Heart from "../common/icons/Heart";
import Spade from "../common/icons/Spade";
import "./ActionButton.scss";

type ActionButtonProps = {
  color?: "primary" | "secondary";
  onClick?: () => void;
  disabled?: boolean;
  label: string;
  type?: "button" | "submit" | "reset";
};

export default function ActionButton({
  color = "primary",
  onClick,
  disabled = false,
  label,
  type = "button",
}: ActionButtonProps) {
  return (
    <Button
      className="ActionButton"
      size="large"
      color={color}
      disabled={disabled}
      onClick={onClick}
      type={type}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onClick && onClick();
        }
      }}
      endIcon={
        <div className="AdornmentContent">
          <Diamond size={18} fill="white" rotate={45} />
          <Club size={18} fill="white" rotate={135} />
        </div>
      }
      startIcon={
        <div className="AdornmentContent">
          <Heart size={18} fill="white" rotate={315} />
          <Spade size={18} fill="white" rotate={225} />
        </div>
      }
    >
      <Typography variant="h6">{label}</Typography>
    </Button>
  );
}
