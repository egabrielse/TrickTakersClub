import HomeIcon from "@mui/icons-material/Home";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { PATHS } from "../../../constants/url";
import { useAppDispatch } from "../../../store/hooks";
import dialogSlice from "../../../store/slices/dialog.slice";
import { ErrorDialogParams } from "../../../types/dialog";
import DialogBody from "../components/DialogBody";
import DialogFooter from "../components/DialogFooter";
import DialogHeader from "../components/DialogHeader";

export default function ErrorDialog({ props }: ErrorDialogParams) {
  const { title, message } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleReturnHome = () => {
    dispatch(dialogSlice.actions.closeDialog());
    navigate(PATHS.ROOT);
  };

  return (
    <>
      <DialogHeader>
        <h2>{title}</h2>
      </DialogHeader>
      <DialogBody>
        <p>{message}</p>
      </DialogBody>
      <DialogFooter>
        <Button
          onClick={handleReturnHome}
          children="Return Home"
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
        />
      </DialogFooter>
    </>
  );
}
