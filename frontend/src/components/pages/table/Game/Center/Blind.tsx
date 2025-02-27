import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../../constants/message";
import { useAppSelector } from "../../../../../store/hooks";
import selectors from "../../../../../store/selectors";
import handSlice from "../../../../../store/slices/hand.slice";
import Card from "../../../../common/Card";
import CardList from "../../../../common/CardList";
import PaperButton from "../../../../common/PaperButton";
import ConnectionContext from "../../ConnectionContext";
import "./Blind.scss";

export default function Blind() {
  const { sendCommand } = useContext(ConnectionContext);
  const isUpNext = useAppSelector(selectors.isUpNext);
  const blindSize = useAppSelector(handSlice.selectors.blindSize);

  const handlePick = () => {
    sendCommand({ name: COMMAND_TYPES.PICK, data: undefined });
  };

  const handlePass = () => {
    sendCommand({ name: COMMAND_TYPES.PASS, data: undefined });
  };

  return (
    <div className="Blind">
      {isUpNext && <PaperButton onClick={handlePick}>Pick</PaperButton>}
      <CardList>
        {Array.from({ length: blindSize }).map((_, index) => (
          <Card
            id={`blind-card-${index}`}
            key={`blind-card-${index}`}
            card="back"
            size="small"
            disabled={!isUpNext}
          />
        ))}
      </CardList>
      {isUpNext && <PaperButton onClick={handlePass}>Pass</PaperButton>}
    </div>
  );
}
