import logo from "/logo.svg";

type AppLogoProps = {
  size: "small" | "medium" | "large" | "xlarge";
};

export default function AppLogo({ size }: AppLogoProps) {
  const translatedSize = size === "xlarge" ? 196 : size === "large" ? 144 : size === "medium" ? 96 : 48;
  return (
    <img
      src={logo}
      className="logo"
      alt="ttc-logo"
      height={translatedSize}
      width={translatedSize}
    />
  );
}
