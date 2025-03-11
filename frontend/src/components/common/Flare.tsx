import "./Flare.scss";

type FlareProps = {
  children: React.ReactNode;
  color: "purple" | "blue" | "darkorange" | "black";
};

export default function Flare({ children, color }: FlareProps) {
  return (
    <span
      className="Flare"
      style={{
        color: color,
        borderColor: color,
      }}
    >
      {typeof children === "string" ? children.toUpperCase() : children}
    </span>
  );
}
