import AppLogo from "../../common/AppLogo";
import PageTopper from "../../common/PageTopper";
import ScrollableContainer from "../../scrollable/ScrollableContainer";
import ScrollableSection from "../../scrollable/ScrollableSection";
import "./HomePage.scss";
import PlayButton from "./PlayButton";

export default function HomePage() {
  return (
    <div className="HomePage">
      <ScrollableContainer
        header={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <PageTopper
              title="Trick Takers Club"
              pre="Welcome to"
              post="The Unofficial Home to Sheepshead"
            />
            <PlayButton />
          </div>
        }
      >
        <ScrollableSection
          id="main"
          title="Sheepshead"
          icon={<AppLogo size="xsmall" />}
        >
          <h3>
            The <i>Unofficial</i> Card Game of Wisconsin
          </h3>
          <p>
            Sheepshead is a complex{" "}
            <a
              target="_blank"
              href="https://en.wikipedia.org/wiki/Trick-taking_game#Point-trick_games"
            >
              point-trick-taking
            </a>{" "}
            card game that is most popular in the state of Wisconsin. It's
            played with a 32 card pack called a Piquet pack, which consists of
            7-10, Jacks, Queens, Kings, and Aces. Most commonly it's played with
            5 players, but variations exist 2-8 players.
          </p>
          <p>
            Despite its steep learning curve, avid card players will find
            Sheepshead to be a rewarding and challenging game, as it requires a
            good bit of strategy, and a little luck.
          </p>
        </ScrollableSection>
      </ScrollableContainer>
    </div>
  );
}
