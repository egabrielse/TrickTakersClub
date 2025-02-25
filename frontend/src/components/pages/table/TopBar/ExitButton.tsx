import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router";
import { DIALOG_TYPES } from "../../../../constants/dialog";
import { PATHS } from "../../../../constants/url";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import dialogSlice from "../../../../store/slices/dialog.slice";
import gameSlice from "../../../../store/slices/game.slice";
import PaperButton from "../../../common/PaperButton";

export default function ExitButton() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const inProgress = useAppSelector(gameSlice.selectors.inProgress);

  /**
   * Leave the table and navigate back to the home page
   */
  const onClick = () => {
    if (inProgress) {
      dispatch(
        dialogSlice.actions.openDialog({
          type: DIALOG_TYPES.CONFIRM_EXIT,
          closeable: true,
        }),
      );
    } else {
      navigate(PATHS.HOME);
    }
  };

  return (
    <PaperButton
      id="exit-button"
      onClick={onClick}
      startIcon={<LogoutIcon style={{ transform: "rotate(180deg)" }} />}
    >
      Exit
    </PaperButton>
  );
}
