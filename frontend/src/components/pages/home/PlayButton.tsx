import { Button } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { PATHS } from "../../../constants/url";
import dialogActions from "../../../redux/features/dialog/actions";
import tableActions from "../../../redux/features/table/actions";
import { useAppDispatch } from "../../../redux/hooks";
import Club from "../../common/icons/Club";
import Diamond from "../../common/icons/Diamond";
import Heart from "../../common/icons/Heart";
import Spade from "../../common/icons/Spade";
import { AuthContext } from "../auth/AuthContextProvider";

export default function PlayButton() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handlePlay = () => {
    if (user === null) {
      dispatch(dialogActions.openDialog({ type: DIALOG_TYPES.LOGIN }));
    } else {
      dispatch(tableActions.createTable())
        .unwrap()
        .then((table) => {
          navigate(PATHS.TABLE.replace(":tableId", table.id));
        });
    }
  };

  return (
    <Button
      style={{ fontSize: 24, gap: "1rem" }}
      variant="contained"
      size="large"
      color="error"
      onClick={handlePlay}
      endIcon={
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <Diamond size={18} fill="white" rotate={45} />
          <Club size={18} fill="white" rotate={135} />
        </div>
      }
      startIcon={
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <Heart size={18} fill="white" rotate={315} />
          <Spade size={18} fill="white" rotate={225} />
        </div>
      }
    >
      Play Sheepshead
    </Button>
  );
}
