import { Button, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { createTable } from "../../../api/table.api";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { PATHS } from "../../../constants/url";
import Club from "../../common/icons/Club";
import Diamond from "../../common/icons/Diamond";
import Heart from "../../common/icons/Heart";
import Spade from "../../common/icons/Spade";
import { DialogContext } from "../../dialog/DialogProvider";
import { AuthContext } from "../auth/AuthContextProvider";
import "./PlayButton.scss";

export default function PlayButton() {
  const { openDialog } = useContext(DialogContext);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handlePlay = () => {
    setLoading(true);
    if (user === null) {
      openDialog({ type: DIALOG_TYPES.LOGIN });
      setLoading(false);
    } else {
      createTable()
        .then((table) => {
          navigate(PATHS.TABLE.replace(":tableId", table.id));
        })
        .catch((error) => {
          console.error(error);
          openDialog({
            type: DIALOG_TYPES.ERROR,
            props: {
              title: "Error Creating Table",
              message: "There was an error creating the table.",
            },
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Button
      className="PlayButton"
      size="large"
      disabled={loading}
      onClick={handlePlay}
      endIcon={
        <div className="AdornmentContent">
          <Diamond size={18} fill="white" rotate={45} />
          <Club size={18} fill="white" rotate={135} />
        </div>
      }
      startIcon={
        <div className="AdornmentContent">
          <Heart size={18} fill="white" rotate={315} />
          <Spade size={18} fill="white" rotate={225} />
        </div>
      }
    >
      <Typography variant="h6">Host Table</Typography>
    </Button>
  );
}
