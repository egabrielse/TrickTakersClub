import { Button } from "@mui/material";
import AppLogo from "../../common/AppLogo";
import AppName from "../../common/AppName";
import CardFanIcon from "../../common/CardFanIcon";
import Tile from "../../layout/Tile";

export default function PlayTile() {
  return (
    <Tile gridArea="play">
      <AppLogo size="xlarge" />
      <AppName width="100%" />
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
