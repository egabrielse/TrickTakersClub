import "./NameBadge.scss";

type NameBadgeProps = {
  role: "partner" | "picker" | "host" | "dealer";
};

export default function NameBadge({ role }: NameBadgeProps) {
  const color =
    role === "partner"
      ? "purple"
      : role === "picker"
        ? "blue"
        : role === "host"
          ? "darkorange"
          : "black";
  return (
    <span
      className="NameBadge"
      style={{
        color: color,
        borderColor: color,
      }}
    >
      {role.toUpperCase()}
    </span>
  );
}
