import { Button } from "@mui/material";
import AppLogo from "../../../common/AppLogo";
import AppName from "../../../common/AppName";
import Tile from "../../../common/Tile";
import CardFanIcon from "../../../common/icons/CardsIcon";

export default function PlayTile() {
  return (
    <Tile gridArea="play">
      <AppLogo size="xxlarge" />
      <AppName size="large" />
      <Button
        size="large"
        variant="contained"
        fullWidth
        startIcon={<CardFanIcon stroke="#ffffff" />}
        endIcon={<CardFanIcon stroke="#ffffff" />}
        style={{ display: "flex", justifyContent: "space-evenly" }}
      >
        Play
      </Button>
    </Tile>
  );
}
