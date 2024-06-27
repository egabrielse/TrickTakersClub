import CircularProgress from "@mui/material/CircularProgress";
import "./Tile.scss";

type TileProps = {
  children: React.ReactNode;
  gridArea?: string;
  loading?: boolean;
  orientation?: "horizontal" | "vertical";
  alignment?: "start" | "center" | "end";
  spacing?: "space-evenly" | "space-between" | "stretch" | "center";
  overflow?: "hidden" | "visible" | "scroll" | "auto";
};

export default function Tile(props: TileProps) {
  const gridArea = props.gridArea;
  const flexDirection = props.orientation === "horizontal" ? "row" : "column";
  const justifyContent = props.spacing || "space-evenly";
  const alignItems = props.alignment || "center";
  const overflow = props.overflow || "hidden";

  return (
    <div
      className="Tile"
      style={{ gridArea, flexDirection, justifyContent, alignItems, overflow }}
    >
      {props.loading ? <CircularProgress /> : props.children}
    </div>
  );
}
