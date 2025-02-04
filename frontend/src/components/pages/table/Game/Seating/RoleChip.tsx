import { Box, Tooltip } from "@mui/material";
type RoleChipProps = {
  role: "dealer" | "d" | "picker" | "pi" | "partner" | "pa";
  size?: "small" | "medium" | "large";
  opacity?: number;
};

export default function RoleChip({ role, size }: RoleChipProps) {
  const pixelSize = size === "small" ? 24 : size === "large" ? 44 : 36;
  const tooltip =
    role === "d"
      ? "Dealer"
      : role === "pi"
        ? "Picker"
        : role === "pa"
          ? "Partner"
          : undefined;
  return (
    <Tooltip title={tooltip} arrow>
      <Box
        className="RoleChip"
        component="img"
        sx={{ height: pixelSize, width: pixelSize }}
        src={`/icons/${role}-chip.svg`}
      />
    </Tooltip>
  );
}
