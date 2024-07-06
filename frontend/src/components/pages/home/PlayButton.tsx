import { Button } from "@mui/material";
import Club from "../../common/icons/Club";
import Diamond from "../../common/icons/Diamond";
import Heart from "../../common/icons/Heart";
import Spade from "../../common/icons/Spade";

export default function PlayButton() {
  const handlePlay = () => {
    // TODO: Implement play button
    console.log("Play Sheepshead");
  };

  return (
    <Button
      style={{ fontSize: 24, gap: "1rem" }}
      variant="contained"
      size="large"
      color="error"
      onClick={handlePlay}
      endIcon={
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <Diamond size={18} fill="white" rotate={45} />
          <Club size={18} fill="white" rotate={135} />
        </div>
      }
      startIcon={
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <Heart size={18} fill="white" rotate={315} />
          <Spade size={18} fill="white" rotate={225} />
        </div>
      }
    >
      Play Sheepshead
    </Button>
  );
}
