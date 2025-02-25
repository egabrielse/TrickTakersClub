import { Tooltip } from "@mui/material";
import classNames from "classnames";
import { useState } from "react";
import "./ExpandingButton.scss";

type ExpandingButtonProps = {
  id: string;
  children: React.ReactNode;
  expandedIcon?: React.ReactNode;
  collapsedIcon?: React.ReactNode;
  defaultExpanded?: boolean;
  title: string;
};

export default function ExpandingButton({
  id,
  children,
  expandedIcon,
  collapsedIcon,
  defaultExpanded,
  title,
}: ExpandingButtonProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div id={id} className={classNames("ExpandingButton", { expanded })}>
      <Tooltip title={expanded ? undefined : title}>
        <div className="ExpandingButton-Button" onClick={toggleExpanded}>
          {expanded ? expandedIcon : collapsedIcon}
        </div>
      </Tooltip>
      <div className="ExpandingButton-Title">{title}</div>
      <div className="ExpandingButton-Content">{children}</div>
    </div>
  );
}
