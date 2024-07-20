import { ReactElement, cloneElement, useState } from "react";
import "./Collapsible.scss";

type CollapsibleProps = {
  children: ReactElement[];
  defaultExpanded?: string;
  title?: string;
};
export default function Collapsible({
  children,
  defaultExpanded,
  title,
}: CollapsibleProps) {
  const [expanded, setExpanded] = useState<string | false>(
    defaultExpanded || false,
  );

  const onChange = (panel: string) => {
    if (expanded === panel) {
      setExpanded(false);
      return;
    }
    setExpanded(panel);
  };

  const renderChildren = () => {
    return children.map((el) => {
      return cloneElement(el, {
        expanded: expanded === el.props.id,
        onChange: onChange,
      });
    });
  };

  return (
    <div className="Collapsible">
      {title && <div className="Collapsible-Title">{title}</div>}
      {renderChildren()}
    </div>
  );
}
