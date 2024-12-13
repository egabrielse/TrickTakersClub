import { Typography } from "@mui/material";
import { Size } from "../../../../types/size";
import { getDisplayNameFontSize } from "../../../../utils/user";
import UserAvatar from "../../../common/UserAvatar";
import "./EmptySeat.scss";

type EmptySeatProps = {
  size?: Size;
};

export default function EmptySeat({ size = "medium" }: EmptySeatProps) {
  const displayNameFontSize = getDisplayNameFontSize(size);

  return (
    <div className="EmptySeat">
      <UserAvatar name="Empty Seat" avatar="🪑" size={size} />
      <Typography
        component="span"
        className="loading-text"
        fontSize={displayNameFontSize}
        fontStyle="italic"
      >
        Empty Seat
      </Typography>
    </div>
  );
}
