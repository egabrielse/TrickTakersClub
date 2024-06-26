import { Button } from "@mui/material";
import Tile from "../../layout/Tile";
import AppLogo from "../../common/AppLogo";
import AppName from "../../common/AppName";
import CardFanIcon from "../../common/CardFanIcon";

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
