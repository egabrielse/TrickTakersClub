import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../../constants/message";
import { PlayingCard } from "../../../../../types/game";
import { findCallableAces } from "../../../../../utils/game";
import Card from "../../../../common/Card";
import PaperButton from "../../../../common/PaperButton";
import { TableState } from "../../TableStateProvider";
import "./Call.scss";

export default function Call() {
  const { hand, sendCommand } = useContext(TableState);
  const callableAces = findCallableAces(hand);

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
