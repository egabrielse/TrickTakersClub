import { ReactNode } from "react";
import "./HeaderSection.scss";

type HeaderSectionProps = {
  children: ReactNode | ReactNode[];
  justify?:
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly"
    | "stretch";
};

export default function HeaderSection({
  children,
  justify = "start",
}: HeaderSectionProps) {
  return (
    <div className="HeaderSection" style={{ justifyContent: justify }}>
      {children}
    </div>
  );
}
