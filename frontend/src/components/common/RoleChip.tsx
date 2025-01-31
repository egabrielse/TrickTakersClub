import { Box } from "@mui/material";
type RoleChipProps = {
  role: "dealer" | "d" | "picker" | "pi" | "partner" | "pa" | "opponent";
  size?: "small" | "medium" | "large";
};

export default function RoleChip({ role, size }: RoleChipProps) {
  const pixelSize = size === "small" ? 24 : size === "large" ? 44 : 32;
  return (
    <Box
      className="RoleChip"
      component="img"
      sx={{ height: pixelSize, width: pixelSize }}
      src={`/icons/${role}-chip.svg`}
    />
  );
}
