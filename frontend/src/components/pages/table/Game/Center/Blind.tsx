import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../../constants/message";
import { useAppSelector } from "../../../../../store/hooks";
import selectors from "../../../../../store/selectors";
import PaperButton from "../../../../common/PaperButton";
import PlayingCard from "../../../../common/PlayingCard";
import PlayingCardList from "../../../../common/PlayingCardList";
import ConnectionContext from "../../ConnectionContext";
import "./Blind.scss";

const BLIND_CARDS = ["back", "back"] as const;

export default function Blind() {
  const { sendCommand } = useContext(ConnectionContext);
  const isUpNext = useAppSelector(selectors.isUpNext);

  const handlePick = () => {
    sendCommand({ name: COMMAND_TYPES.PICK, data: undefined });
  };

  const handlePass = () => {
    sendCommand({ name: COMMAND_TYPES.PASS, data: undefined });
  };

  return (
    <div className="Blind">
      {isUpNext && <PaperButton onClick={handlePick}>Pick</PaperButton>}
      <PlayingCardList>
        {BLIND_CARDS.map((card, index) => (
          <PlayingCard
            id={`blind-card-${index}`}
            key={`blind-card-${index}`}
            card={card}
            size="small"
            disabled={!isUpNext}
          />
        ))}
      </PlayingCardList>
      {isUpNext && <PaperButton onClick={handlePass}>Pass</PaperButton>}
    </div>
  );
}
