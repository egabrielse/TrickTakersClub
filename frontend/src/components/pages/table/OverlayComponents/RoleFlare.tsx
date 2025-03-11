import Flare from "../../../common/Flare";

type RoleFlareProps = {
  role: "partner" | "picker" | "host" | "dealer";
};

export default function RoleFlare({ role }: RoleFlareProps) {
  const color =
    role === "partner"
      ? "purple"
      : role === "picker"
        ? "blue"
        : role === "host"
          ? "darkorange"
          : "black";
  return <Flare color={color}>{role}</Flare>;
}
