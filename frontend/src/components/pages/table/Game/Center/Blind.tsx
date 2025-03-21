import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../../constants/message";
import { useAppSelector } from "../../../../../store/hooks";
import { selectIsUpNext } from "../../../../../store/selectors";
import handSlice from "../../../../../store/slices/hand.slice";
import PaperButton from "../../../../common/PaperButton";
import PlayingCard from "../../../../common/PlayingCard";
import PlayingCardList from "../../../../common/PlayingCardList";
import ConnectionContext from "../../ConnectionContext";
import "./Blind.scss";

const BLIND_CARDS = ["back", "back"] as const;

export default function Blind() {
  const { sendCommand } = useContext(ConnectionContext);
  const isUpNext = useAppSelector(selectIsUpNext);
  const noPickHand = useAppSelector(handSlice.selectors.noPickHand);

  const handlePick = () => {
    sendCommand({ name: COMMAND_TYPES.PICK, data: undefined });
  };

  const handlePass = () => {
    sendCommand({ name: COMMAND_TYPES.PASS, data: undefined });
  };

  return (
    <div className="Blind">
      {isUpNext && !noPickHand && (
        <PaperButton onClick={handlePick}>Pick</PaperButton>
      )}
      <PlayingCardList>
        {BLIND_CARDS.map((card, index) => (
          <PlayingCard
            id={`blind-card-${index}`}
            key={`blind-card-${index}`}
            card={card}
            disabled={!isUpNext || noPickHand}
          />
        ))}
      </PlayingCardList>
      {isUpNext && !noPickHand && (
        <PaperButton onClick={handlePass}>Pass</PaperButton>
      )}
    </div>
  );
}
