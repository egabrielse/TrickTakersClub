import Typography from "@mui/material/Typography";

type StyledNumberProps = {
  value: number;
};

export default function StyledNumber({ value }: StyledNumberProps) {
  const color = value > 0 ? "green" : value < 0 ? "red" : undefined;
  const prefix = value > 0 ? "+" : "";
  return (
    <Typography color={color} variant="body1">
      {prefix}
      {value}
    </Typography>
  );
}
