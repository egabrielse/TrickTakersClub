import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router";
import { PATHS } from "../../../../constants/url";
import PaperButton from "../../../common/PaperButton";

export default function ExitButton() {
  // TODO: confirm exit if game in progress
  const navigate = useNavigate();

  /**
   * Leave the table and navigate back to the home page
   */
  const onClick = () => navigate(PATHS.HOME);

  return (
    <PaperButton
      onClick={onClick}
      startIcon={<LogoutIcon style={{ transform: "rotate(180deg)" }} />}
    >
      Exit
    </PaperButton>
  );
}
