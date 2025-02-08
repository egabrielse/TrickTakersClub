import { HAND_PHASE } from "../../../../../constants/game";
import selectors from "../../../../../store/selectors";
import handSlice from "../../../../../store/slices/hand.slice";
import { useAppSelector } from "../../../../../store/store";
import Blind from "./Blind";
import Call from "./Call";
import "./Center.scss";
import Trick from "./Trick";

export default function Center() {
  const isUpNext = useAppSelector(selectors.isUpNext);
  const blindSize = useAppSelector(handSlice.selectors.blindSize);
  const phase = useAppSelector(handSlice.selectors.phase);

  const renderCenterNode = () => {
    switch (phase) {
      case HAND_PHASE.PICK:
        return <Blind />;
      case HAND_PHASE.CALL:
        if (isUpNext) {
          return <Call />;
        }
        return <span className="loading-text">Waiting for picker to call</span>;
      case HAND_PHASE.BURY:
        if (isUpNext) {
          return `Bury ${blindSize} cards`;
        }
        return <span className="loading-text">Waiting for picker to bury</span>;
      case HAND_PHASE.PLAY:
        return <Trick />;
      default:
        return <span className="loading-text">Waiting</span>;
    }
  };

  return (
    <div className="Center" style={{ width: 300, height: 300 }}>
      {renderCenterNode()}
    </div>
  );
}
