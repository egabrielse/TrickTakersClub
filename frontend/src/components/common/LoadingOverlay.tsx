import { CircularProgress } from "@mui/material";
import "./LoadingOverlay.scss";

export default function LoadingOverlay() {
  return (
    <div className="LoadingOverlay">
      <CircularProgress />
    </div>
  );
}
