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
  notification?: boolean | number;
  onToggleExpanded?: (expanded: boolean) => void;
};

export default function ExpandingButton({
  id,
  children,
  expandedIcon,
  collapsedIcon,
  defaultExpanded,
  title,
  notification = false,
  onToggleExpanded = () => {},
}: ExpandingButtonProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || false);
  const [renderContent, setRenderContent] = useState(defaultExpanded || false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    onToggleExpanded(!expanded);
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
      if (notification > 9) {
        return "9+";
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
      <Tooltip title={expanded ? undefined : title}>
        <div className="ExpandingButton-Button" onClick={toggleExpanded}>
          {expanded ? expandedIcon : collapsedIcon}
        </div>
      </Tooltip>
      <div className="ExpandingButton-Title">{title}</div>
      <div className="ExpandingButton-Content">{renderContent && children}</div>
    </div>
  );
}
