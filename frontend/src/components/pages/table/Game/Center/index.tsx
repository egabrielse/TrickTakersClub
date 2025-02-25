import { HAND_PHASE } from "../../../../../constants/game";
import { useAppSelector } from "../../../../../store/hooks";
import selectors from "../../../../../store/selectors";
import handSlice from "../../../../../store/slices/hand.slice";
import Blind from "./Blind";
import Call from "./Call";
import "./index.scss";
import Trick from "./Trick";

export default function Center() {
  const isUpNext = useAppSelector(selectors.isUpNext);
  const phase = useAppSelector(handSlice.selectors.phase);

  const renderCenterNode = () => {
    switch (phase) {
      case HAND_PHASE.PICK:
        return <Blind />;
      case HAND_PHASE.CALL:
        if (isUpNext) {
          return <Call />;
        }
        return null;
      case HAND_PHASE.BURY:
        return null;
      case HAND_PHASE.PLAY:
        return <Trick />;
      default:
        return null;
    }
  };

  return (
    <div id="game-center" className="Center">
      {renderCenterNode()}
    </div>
  );
}
