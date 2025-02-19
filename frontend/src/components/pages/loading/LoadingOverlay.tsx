import classNames from "classnames";
import { PuffLoader } from "react-spinners";
import "./LoadingOverlay.scss";

type LoadingOverlayProps = {
  text?: string;
  trailingEllipsis?: boolean;
};

export default function LoadingOverlay({
  text,
  trailingEllipsis,
}: LoadingOverlayProps) {
  return (
    <div className="LoadingOverlay">
      <PuffLoader color="white" size={64} />
      {text && (
        <span className={classNames({ "loading-text": trailingEllipsis })}>
          {text}
        </span>
      )}
    </div>
  );
}
