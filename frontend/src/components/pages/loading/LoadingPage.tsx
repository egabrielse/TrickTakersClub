import { CircularProgress } from "@mui/material";
import "./LoadingPage.scss";

export default function LoadingPage() {
  return (
    <div className="LoadingPage">
      <CircularProgress />
    </div>
  );
}
