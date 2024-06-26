import { Size } from "../../types/size";
import { scaleBySize } from "../../utils/size";
import logo from "/logo.svg";

type AppLogoProps = {
  size: Size;
};

export default function AppLogo({ size }: AppLogoProps) {
  const pixelSize = scaleBySize(size, 64);
  return (
    <img
      src={logo}
      className="logo"
      alt="ttc-logo"
      height={pixelSize}
      width={pixelSize}
    />
  );
}
