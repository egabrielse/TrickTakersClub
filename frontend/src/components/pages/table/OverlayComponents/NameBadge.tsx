import "./NameBadge.scss";

type NameBadgeProps = {
  children: string;
  color?: "blue" | "darkorange" | "purple" | "black";
};

export default function NameBadge({ children, color }: NameBadgeProps) {
  return (
    <span
      className="NameBadge"
      style={{
        color: color,
        borderColor: color,
      }}
    >
      {children.toUpperCase()}
    </span>
  );
}
