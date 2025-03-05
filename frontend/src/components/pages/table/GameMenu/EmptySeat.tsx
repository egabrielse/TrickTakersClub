import { Avatar, Typography } from "@mui/material";
import "./EmptySeat.scss";

export default function EmptySeat() {
  return (
    <div className="EmptySeat">
      <Avatar
        alt={"Empty Seat"}
        sizes="large"
        sx={{
          border: "1px solid #FFFFFF",
          bgcolor: "#FFFFFF",
          width: 32,
          height: 32,
          fontSize: 24,
          color: "#FFFFFF",
        }}
        children={"🪑"}
      />
      <Typography
        component="span"
        className="loading-text"
        fontSize={14}
        fontStyle="italic"
        noWrap
      >
        Empty Seat
      </Typography>
    </div>
  );
}
