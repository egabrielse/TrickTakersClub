import { GameSummaryDialogParams } from "../../../types/dialog";
import AppLogo from "../../common/AppLogo";
import ScoreboardDisplay from "../../pages/table/OverlayComponents/ScoreboardDisplay";
import CloseDialogButton from "../components/CloseDialogButton";
import DialogBody from "../components/DialogBody";
import DialogHeader from "../components/DialogHeader";

export default function GameSummaryDialog({ props }: GameSummaryDialogParams) {
  const { scoreboard } = props;

  return (
    <>
      <CloseDialogButton />
      <DialogHeader>
        <AppLogo size="large" />
        <h2>Final Scores!</h2>
      </DialogHeader>
      <DialogBody>
        <ScoreboardDisplay scoreboard={scoreboard} namesExpanded />
      </DialogBody>
    </>
  );
}
