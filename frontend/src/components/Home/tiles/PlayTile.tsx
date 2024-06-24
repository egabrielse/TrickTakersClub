import { Button } from '@mui/material';
import Tile from '../../common/Tile';
import AppLogo from '../../common/AppLogo';
import AppName from '../../common/AppName';

export default function PlayTile() {
  return (
    <Tile gridArea='play-tile'>
      <AppLogo size='large' />
      <AppName size='large' />
      <Button variant='contained' fullWidth>
        Play
      </Button>
    </Tile>
  );
}
