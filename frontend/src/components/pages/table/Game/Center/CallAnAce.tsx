import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../../constants/message";
import { useAppSelector } from "../../../../../store/hooks";
import selectors from "../../../../../store/selectors";
import { Card } from "../../../../../types/card";
import PaperButton from "../../../../common/PaperButton";
import PrintedCard from "../../../../common/PrintedCard";
import ConnectionContext from "../../ConnectionContext";
import "./CallAnAce.scss";

export default function CallAnAce() {
  const { sendCommand } = useContext(ConnectionContext);
  const callableAces = useAppSelector(selectors.callableAces);

  const handleCallCard = (card: Card) => {
    sendCommand({ name: COMMAND_TYPES.CALL, data: { card } });
  };

  const handleGoAlone = () => {
    sendCommand({ name: COMMAND_TYPES.GO_ALONE, data: undefined });
  };

  return (
    <div className="CallAnAce">
      {callableAces.map((suit) => {
        return (
          <PaperButton
            key={`call-${suit}-btn`}
            onClick={() => handleCallCard({ suit, rank: "ace" })}
          >
            <PrintedCard suit={suit} rank={"ace"} />
          </PaperButton>
        );
      })}
      <PaperButton key={"go-alone-btn"} onClick={handleGoAlone}>
        Go Alone
      </PaperButton>
    </div>
  );
}
