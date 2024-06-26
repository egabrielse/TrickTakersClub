import './DialogErrorMessage.scss';
import IconButton from '@mui/material/IconButton';
import CloseIcon from "@mui/icons-material/Close";


type DialogErrorMessageProps = {
  error?: string | null;
  clearError: () => void;
}

export default function DialogErrorMessage({ error, clearError }: DialogErrorMessageProps) {
  if (!error) return null;
  return (
    <div className="DialogErrorMessage">
      {error}
      <IconButton onClick={clearError} size="small">
        <CloseIcon />
      </IconButton>
    </div>
  )
}