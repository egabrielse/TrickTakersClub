import './Tile.scss'
import Card from "@mui/material/Card"

type TileProps = {
  children: React.ReactNode;
};

export default function Tile({ children }: TileProps) {
  return (
    <Card className="Tile" elevation={4}>
      {children}
    </Card>
  );
}
