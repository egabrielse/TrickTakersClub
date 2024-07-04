import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import "./DialogMessage.scss";

type DialogMessageProps = {
  message?: string | null;
  type: "error" | "info" | "success";
  clear?: () => void;
};

export default function DialogMessage({
  message,
  type,
  clear,
}: DialogMessageProps) {
  if (!message) return null;
  return (
    <div className={`DialogMessage ${type}`}>
      {message}
      {clear && (
        <IconButton onClick={clear} size="small">
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
}
