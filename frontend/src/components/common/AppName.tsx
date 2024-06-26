import { Size } from '../../types/size';
import { getAppNameFontSize } from '../../utils/size';
import './AppName.scss'

type AppNameProps = {
  size: Size;
};

export default function AppName({ size }: AppNameProps) {
  const fontSize = getAppNameFontSize(size);
  return (
    <span className="AppName" style={{ fontSize, textAlign: "center" }}>
      Trick Takers Club
    </span>
  );
}
