import LogoutIcon from "@mui/icons-material/Logout";
import { useChannel, usePresence, usePresenceListener } from "ably/react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { PATHS } from "../../../constants/url";
import PaperButton from "../../common/PaperButton";
import { DialogContext } from "../../dialog/DialogProvider";
import { AuthContext } from "../auth/AuthContextProvider";
import Chat from "./Chat/Chat";
import GameSettings from "./GameSettings";
import LinkButton from "./LinkButton";
import { TableStateContext } from "./TableContextProvider";
import "./TablePage.scss";

export default function TablePage() {
  const { user } = useContext(AuthContext);
  const { table } = useContext(TableStateContext);
  const { openDialog } = useContext(DialogContext);
  const navigate = useNavigate();

  usePresence(table.id);

  usePresenceListener(table.id, (presence) => {
    console.log(presence);
  });

  useChannel(table.id, "timeout", () => {
    // navigate to the home page if the table times out
    openDialog({
      type: DIALOG_TYPES.ERROR,
      closeable: false,
      props: {
        title: "Timeout Due to Inactivity",
        message: "The table was inactive for too long.",
      },
    });
  });

  const handleLeaveTable = () => {
    navigate(PATHS.HOME);
  };

  return (
    <div className="TablePage">
      <PaperButton
        className="TablePage-ExitButton"
        onClick={handleLeaveTable}
        startIcon={<LogoutIcon style={{ transform: "rotate(180deg)" }} />}
      >
        Exit
      </PaperButton>
      <div className="TablePage-Main">
        {user?.uid === table.hostId && <GameSettings />}
      </div>
      <div className="TablePage-SideBar">
        <LinkButton tableId={table.id} />
        <Chat />
      </div>
    </div>
  );
}
