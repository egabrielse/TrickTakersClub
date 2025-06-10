import { useContext } from "react";
import { useAppSelector } from "../../../../../store/hooks";
import { selectCallableAces } from "../../../../../store/selectors";
import { Card, FailSuit } from "../../../../../types/card";
import {
  newCallCommand,
  newGoAloneCommand,
} from "../../../../../utils/message";
import PaperButton from "../../../../common/PaperButton";
import PrintedCard from "../../../../common/PrintedCard";
import SessionContext from "../../SessionContext";
import "./CallAnAce.scss";

export default function CallAnAce() {
  const { sendCommand } = useContext(SessionContext);
  const callableAces = useAppSelector(selectCallableAces);

  const handleCallCard = (card: Card) => sendCommand(newCallCommand({ card }));

  const handleGoAlone = () => sendCommand(newGoAloneCommand());

  return (
    <div className="CallAnAce">
      {Object.entries(callableAces).map(([suit, callable]) =>
        callable ? (
          <PaperButton
            key={`call-${suit}-btn`}
            onClick={() =>
              handleCallCard({ suit: suit as FailSuit, rank: "ace" })
            }
          >
            <PrintedCard suit={suit as FailSuit} rank={"ace"} />
          </PaperButton>
        ) : null,
      )}
      <PaperButton key={"go-alone-btn"} onClick={handleGoAlone}>
        Go Alone
      </PaperButton>
    </div>
  );
}
