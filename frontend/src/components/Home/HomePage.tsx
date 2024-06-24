import Tile from '../common/Tile';
import './HomePage.scss';
import PlayTile from './tiles/PlayTile';
import ProfileTile from './tiles/ProfileTile';

export default function HomePage() {
  return (
    <div className='HomePage'>
      <Tile gridArea='A'>A</Tile>
      <PlayTile />
      <Tile gridArea='C'>C</Tile>
      <Tile gridArea='D'>D</Tile>
      <ProfileTile />
      <Tile gridArea='F'>F</Tile>
    </div>
  )
}