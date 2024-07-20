import PreviewIcon from "@mui/icons-material/Preview";
import ScoreBoardIcon from "@mui/icons-material/Scoreboard";
import { useLocation } from "react-router";
import PageTopper from "../../common/PageTopper";
import CardsIcon from "../../common/icons/CardsIcon";
import DealerIcon from "../../common/icons/DealerIcon";
import Hand from "../../common/icons/Hand";
import ShapesIcon from "../../common/icons/ShapesIcon";
import Scrollable from "../../common/scrollable/Scrollable";
import ScrollableSection from "../../common/scrollable/ScrollableSection";
import "./RulesPage.scss";
import Dealing from "./sections/Dealing";
import Overview from "./sections/Overview";
import Picking from "./sections/Picking";
import Playing from "./sections/Playing";
import Scoring from "./sections/Scoring";
import Variations from "./sections/Variations";

const SECTIONS = {
  OVERVIEW: "setup",
  DEALING: "dealing",
  PICKING: "picking",
  PLAYING: "playing",
  SCORING: "scoring",
  VARIATIONS: "variations",
} as const;

export default function RulesPage() {
  const location = useLocation();

  console.log(location);
  return (
    <div className="RulesPage">
      <Scrollable
        header={<PageTopper hideLogo title="Sheepshead" pre="How to play" />}
      >
        <ScrollableSection
          id={SECTIONS.OVERVIEW}
          title="Overview"
          icon={<PreviewIcon />}
        >
          <Overview />
        </ScrollableSection>
        <ScrollableSection
          id={SECTIONS.DEALING}
          title="Dealing"
          icon={<DealerIcon />}
        >
          <Dealing />
        </ScrollableSection>
        <ScrollableSection
          id={SECTIONS.PICKING}
          title="Picking"
          icon={<CardsIcon />}
        >
          <Picking />
        </ScrollableSection>
        <ScrollableSection
          id={SECTIONS.PLAYING}
          title="Playing"
          icon={<Hand />}
        >
          <Playing />
        </ScrollableSection>
        <ScrollableSection
          id={SECTIONS.PLAYING}
          title="Scoring"
          icon={<ScoreBoardIcon />}
        >
          <Scoring />
        </ScrollableSection>
        <ScrollableSection
          id={SECTIONS.VARIATIONS}
          title="Variations"
          icon={<ShapesIcon />}
        >
          <Variations />
        </ScrollableSection>
      </Scrollable>
    </div>
  );
}
