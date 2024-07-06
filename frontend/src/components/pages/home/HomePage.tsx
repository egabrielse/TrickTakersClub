import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { PATHS } from "../../../constants/url";
import AppLogo from "../../common/AppLogo";
import AppName from "../../common/AppName";
import Tile from "../../common/Tile";
import "./HomePage.scss";
import PlayButton from "./PlayButton";

export default function HomePage() {
  const navigate = useNavigate();

  const handleRulesClick = () => {
    navigate(PATHS.RULES);
  };

  return (
    <div className="HomePage">
      <div className="HomePage-Header">
        <AppLogo size="xlarge" color="white" />
        <div className="HomePage-Header-AnnotatedName">
          <h3>Welcome to</h3>
          <AppName size="xlarge" color="white" />
          <h4>Play Sheepshead Online</h4>
        </div>
      </div>
      <PlayButton />
      <Tile flex={1} alignment="start" spacing="stretch">
        <div>
          <h1>Sheepshead</h1>
          <h3>
            Wisconsin's <i>Unofficial</i> State Card Game
          </h3>
        </div>
        <p>
          Sheepshead is a complex point-trick-taking card game that is most
          popular in the state of Wisconsin. It is played with 32 cards from a
          Piquet deck (7-10, J, Q, K, A) and is most commonly played with 5
          players.
        </p>
        <p>
          Though the game can have a steep learning curve, avid card players
          will find it to be a rewarding and challenging game, requiring a lot
          of strategy and skill, and a bit of luck.
        </p>
        <Button variant="contained" color="primary" onClick={handleRulesClick}>
          Rules
        </Button>
      </Tile>
    </div>
  );
}
