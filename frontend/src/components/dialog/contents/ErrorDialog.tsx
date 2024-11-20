import HomeIcon from "@mui/icons-material/Home";
import { Button } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { PATHS } from "../../../constants/url";
import { DialogContext } from "../../pages/providers/DialogContextProvider";
import DialogBody from "../components/DialogBody";
import DialogFooter from "../components/DialogFooter";
import DialogHeader from "../components/DialogHeader";

type ErrorDialogProps = {
  title: string;
  message: string;
};

export default function ErrorDialog({ title, message }: ErrorDialogProps) {
  const navigate = useNavigate();
  const { closeDialog } = useContext(DialogContext);

  const handleReturnHome = () => {
    closeDialog();
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
