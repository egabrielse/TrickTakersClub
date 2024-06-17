import logo from "/logo-shades.svg";

type LogoProps = {
  size: "small" | "medium" | "large";
};

export default function Logo({ size }: LogoProps) {
  const translatedSize = size === "large" ? 144 : size === "medium" ? 96 : 48;
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
