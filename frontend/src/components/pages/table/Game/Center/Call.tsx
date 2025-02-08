import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../../constants/message";
import handSlice from "../../../../../store/slices/hand.slice";
import { useAppSelector } from "../../../../../store/store";
import { PlayingCard } from "../../../../../types/card";
import Card from "../../../../common/Card";
import PaperButton from "../../../../common/PaperButton";
import ConnectionContext from "../../ConnectionContext";
import "./Call.scss";

export default function Call() {
  const { sendCommand } = useContext(ConnectionContext);
  const callableAces = useAppSelector(handSlice.selectors.callableAces);

  const handleCallCard = (card: PlayingCard) => {
    sendCommand({ name: COMMAND_TYPES.CALL, data: { card } });
  };

  const handleGoAlone = () => {
    sendCommand({ name: COMMAND_TYPES.GO_ALONE, data: undefined });
  };

  return (
    <div className="Call">
      {callableAces.map((ace) => {
        return (
          <Card
            id={`${ace.rank}-${ace.suit}`}
            key={`${ace.rank}-${ace.suit}`}
            card={ace}
            onClick={() => handleCallCard(ace)}
          />
        );
      })}
      <PaperButton onClick={handleGoAlone}>Go Alone</PaperButton>
    </div>
  );
}
