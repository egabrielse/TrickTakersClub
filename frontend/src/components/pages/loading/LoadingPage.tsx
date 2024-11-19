import { PuffLoader } from "react-spinners";
import "./LoadingPage.scss";

export default function LoadingPage() {
  return (
    <div className="LoadingPage">
      <PuffLoader color="white" size={64} />
    </div>
  );
}
