import { useContext } from "react";
import { useAppSelector } from "../../../../../store/hooks";
import { selectIsUpNext } from "../../../../../store/selectors";
import handSlice from "../../../../../store/slices/hand.slice";
import { newPassCommand, newPickCommand } from "../../../../../utils/message";
import PaperButton from "../../../../common/PaperButton";
import PlayingCard from "../../../../common/PlayingCard";
import PlayingCardList from "../../../../common/PlayingCardList";
import SessionContext from "../../SessionContext";
import "./Blind.scss";

const BLIND_CARDS = ["back", "back"] as const;

export default function Blind() {
  const { sendCommand } = useContext(SessionContext);
  const isUpNext = useAppSelector(selectIsUpNext);
  const noPickHand = useAppSelector(handSlice.selectors.noPickHand);

  const handlePick = () => sendCommand(newPickCommand());

  const handlePass = () => sendCommand(newPassCommand());

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
