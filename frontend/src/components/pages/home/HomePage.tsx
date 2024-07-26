import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { PATHS } from "../../../constants/url";
import PageTopper from "../../common/PageTopper";
import "./HomePage.scss";
import PlayButton from "./PlayButton";

export default function HomePage() {
  const navigate = useNavigate();

  const handleRulesClick = () => {
    navigate(PATHS.RULES);
  };

  return (
    <div className="HomePage">
      <PageTopper
        title="Trick Takers Club"
        pre="Welcome to"
        post="Home to Sheepshead"
      />
      <PlayButton />
      <h1>The Unofficial Card Game of Wisconsin</h1>
      <div>
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
        <Button onClick={handleRulesClick} variant="contained" color="primary">
          Learn the Rules
        </Button>
      </div>
    </div>
  );
}
