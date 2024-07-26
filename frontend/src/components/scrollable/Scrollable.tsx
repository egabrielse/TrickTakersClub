import { ReactElement } from "react";
import "./Scrollable.scss";

type ScrollableProps = {
  children: ReactElement | ReactElement[];
  header?: ReactElement;
};
export default function Scrollable({ children, header }: ScrollableProps) {
  return (
    <div className="Scrollable">
      {header && <div className="Scrollable-Header">{header}</div>}
      {children}
    </div>
  );
}
