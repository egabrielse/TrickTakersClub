import EastIcon from "@mui/icons-material/East";
import { useCallback, useContext, useEffect } from "react";
import { useResizeDetector } from "react-resize-detector";
import { HAND_PHASE } from "../../../../../constants/game";
import { AuthContext } from "../../../auth/AuthContextProvider";
import { TableState } from "../../TablePage";
import Blind from "./Blind";
import "./Center.scss";
import Trick from "./Trick";

export default function Center() {
  const { user } = useContext(AuthContext);
  const { upNextId, handInProgress, phase, blindSize, playerOrder } =
    useContext(TableState);
  const isPlayerTurn = user?.uid === upNextId;

  const renderCenterNode = () => {
    if (!handInProgress) {
      return "Game not started";
    } else if (!isPlayerTurn) {
      return "Waiting for turn";
    }
    switch (phase) {
      case HAND_PHASE.PICK:
        return <Blind blindSize={blindSize} />;
      case HAND_PHASE.CALL:
        if (isPlayerTurn) {
          return "TODO"; // TODO: Implement call phase
        }
        return `Waiting for picker to call...`;
      case HAND_PHASE.BURY:
        if (isPlayerTurn) {
          return `Bury ${blindSize} cards`;
        }
        return `Waiting for picker to bury...`;
      case HAND_PHASE.PLAY:
        return <Trick />;
      default:
        return "Waiting...";
    }
  };

  const placePointer = useCallback(() => {
    if (!upNextId) return;
    const radius = 300 / 1.75;
    const step = (2 * Math.PI) / playerOrder.length;
    const index = playerOrder.indexOf(upNextId);
    const angle = Math.PI / 2 + index * step;
    const pointer = document.getElementById(`up-next-pointer`);
    if (pointer) {
      pointer.style.left = `${300 / 2 + radius * Math.cos(angle) - pointer.offsetWidth / 2}px`;
      pointer.style.top = `${300 / 2 + radius * Math.sin(angle) - pointer.offsetHeight / 2}px`;
      pointer.style.transform = `rotate(${angle}rad)`;
    }
  }, [playerOrder, upNextId]);

  const { ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: "debounce",
    refreshRate: 250,
    onResize: placePointer,
  });

  useEffect(() => {
    placePointer();
  }, [placePointer]);

  return (
    <div ref={ref} className="Center" style={{ width: 300, height: 300 }}>
      {renderCenterNode()}
      {upNextId && (
        <div id="up-next-pointer" className="Center-UpNextPointer">
          <EastIcon fontSize="large" htmlColor="white" />
        </div>
      )}
    </div>
  );
}
