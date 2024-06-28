import AppLogo from "../common/AppLogo";
import Tile from "../layout/Tile";
import "./HomePage.scss";
import PlayTile from "./tiles/PlayTile";
import ProfileTile from "./tiles/ProfileTile";

export default function HomePage() {
  return (
    <div className="HomePage">
      <PlayTile />
      <ProfileTile />
      <Tile gridArea="C">
        <AppLogo size="large" color="white" />
      </Tile>
    </div>
  );
}
