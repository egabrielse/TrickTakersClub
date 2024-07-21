import { Size } from "../../types/size";
import { getAppNameFontSize } from "../../utils/size";
import "./StyledTitle.scss";

type StyledTitleProps = {
  title: string;
  size?: Size;
  width?: "100%" | "auto";
  color?: string;
  onClick?: () => void;
};

export default function StyledTitle({
  title,
  size,
  color = "black",
  width,
  onClick,
}: StyledTitleProps) {
  const fontSize = size ? getAppNameFontSize(size) : undefined;
  const cursor = onClick ? "pointer" : "default";
  return (
    <div
      onClick={onClick}
      className="StyledTitle"
      style={{ cursor, fontSize, color, width }}
    >
      {title.toUpperCase()}
    </div>
  );
}
