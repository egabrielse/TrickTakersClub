import { CardContent, CardHeader, CircularProgress } from '@mui/material';
import './Tile.scss'
import Card from "@mui/material/Card"

type TileProps = {
  children: React.ReactNode;
  gridArea?: string;
  loading?: boolean;
  title?: string;
  titleIcon?: React.ReactNode;
};

export default function Tile({ children, gridArea, loading, title, titleIcon }: TileProps) {
  return (
    <Card className="Tile" elevation={4} style={{ gridArea }}>
      {title && (
        <CardHeader title={title} avatar={titleIcon} />
      )}
      <CardContent className='Tile-Content'>
        {loading ? (
          <CircularProgress />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
