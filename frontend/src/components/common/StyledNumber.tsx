import Typography from "@mui/material/Typography";

type StyledNumberProps = {
  children: number;
};

export default function StyledNumber({ children }: StyledNumberProps) {
  const color = children > 0 ? "success" : children < 0 ? "error" : undefined;
  const prefix = children > 0 ? "+" : "";
  return (
    <Typography color={color} fontWeight="bold" variant="body1">
      {prefix}
      {children}
    </Typography>
  );
}
