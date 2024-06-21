import './AuthPageLayout.scss'
import Grid from '@mui/material/Grid'
import Tile from '../common/Tile';

type AuthPageLayoutProps = {
  children: React.ReactNode;
};

export default function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="AuthPageLayout">
      <Grid className='AuthPageLayout-Grid' container columns={1} width="50%" maxWidth={500} maxHeight={750}>
        <Grid item xs={1} sm={1} md={1} lg={1}>
          <Tile>
            {children}
          </Tile>  
        </Grid>
      </Grid>
    </div>
  )
}