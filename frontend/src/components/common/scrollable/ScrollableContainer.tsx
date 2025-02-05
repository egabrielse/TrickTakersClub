import { ReactElement } from "react";
import "./ScrollableContainer.scss";

type ScrollableProps = {
  children: ReactElement | ReactElement[];
  header?: ReactElement;
};
export default function ScrollableContainer({
  children,
  header,
}: ScrollableProps) {
  return (
    <div className="ScrollableContainer">
      {header && <div className="ScrollableContainer-Header">{header}</div>}
      {children}
    </div>
  );
}
