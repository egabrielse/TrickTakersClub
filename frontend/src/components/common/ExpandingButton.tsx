import { Tooltip } from "@mui/material";
import classNames from "classnames";
import { useMemo, useState } from "react";
import "./ExpandingButton.scss";

type ExpandingButtonProps = {
  id: string;
  children: React.ReactNode;
  expandedIcon?: React.ReactNode;
  collapsedIcon?: React.ReactNode;
  defaultExpanded?: boolean;
  title: string;
  tooltip?: string;
  notification?: boolean | number;
  onToggle?: (expanded: boolean) => void;
};

export default function ExpandingButton({
  id,
  children,
  expandedIcon,
  collapsedIcon,
  defaultExpanded,
  title,
  tooltip,
  notification = false,
  onToggle = () => {},
}: ExpandingButtonProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || false);
  const [renderContent, setRenderContent] = useState(defaultExpanded || false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    onToggle(!expanded);
    if (!expanded) {
      // Instantly render content when expanding
      setRenderContent(true);
    } else {
      // Wait for collapse animation to finish before unrendering content
      setTimeout(() => setRenderContent(!expanded), 250);
    }
  };

  const badgeContent = useMemo(() => {
    if (typeof notification === "number") {
      if (notification > 99) {
        return "99+";
      } else if (notification > 0) {
        return String(notification);
      } else {
        return false;
      }
    } else if (notification) {
      return "";
    }
    return false;
  }, [notification]);

  return (
    <div id={id} className={classNames("ExpandingButton", { expanded })}>
      {!expanded && badgeContent && (
        <div
          className="ExpandingButton-NotificationDot"
          style={{
            padding: badgeContent.length >= 2 ? "0px 0.25em" : undefined,
          }}
        >
          {badgeContent}
        </div>
      )}
      <Tooltip title={expanded ? undefined : tooltip}>
        <div className="ExpandingButton-Button" onClick={toggleExpanded}>
          {expanded ? expandedIcon : collapsedIcon}
        </div>
      </Tooltip>
      <div className="ExpandingButton-Title">{title}</div>
      <div className="ExpandingButton-Content">{renderContent && children}</div>
    </div>
  );
}
