import { Paper, Typography } from "@mui/material";
import "./ScrollableSection.scss";

type ScrollableSectionProps = {
  children: React.ReactNode;
  expanded?: boolean;
  icon?: React.ReactNode;
  id: string;
  title: string;
};
export default function ScrollableSection({
  children,
  icon,
  id,
  title,
}: ScrollableSectionProps) {
  return (
    <Paper component={"section"} key={title} className="ScrollableSection">
      <div id={id} className="ScrollableSection-Header">
        {icon && icon}
        <Typography variant="h4">{title}</Typography>
      </div>
      <div className="ScrollableSection-Body">{children}</div>
    </Paper>
  );
}
