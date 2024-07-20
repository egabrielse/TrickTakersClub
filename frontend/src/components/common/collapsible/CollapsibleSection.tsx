import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import "./CollapsibleSection.scss";

type CollapsibleProps = {
  children: React.ReactNode;
  expanded?: boolean;
  icon?: React.ReactNode;
  id: string;
  onChange?: (id: string) => void;
  title: string;
};
export default function CollapsibleSection({
  children,
  expanded,
  icon,
  id,
  onChange,
  title,
}: CollapsibleProps) {
  const handleOnChange = (panelId: string) => {
    if (!onChange) return undefined;
    return () => {
      onChange(panelId);
    };
  };

  return (
    <Accordion
      className="CollapsibleSection"
      expanded={expanded}
      onChange={handleOnChange(id)}
      slotProps={{ transition: { unmountOnExit: false } }}
    >
      <AccordionSummary
        className="CollapsibleSection-Header"
        expandIcon={<ArrowDropDownIcon />}
      >
        {icon && icon}
        <h3>{title}</h3>
      </AccordionSummary>
      <AccordionDetails className="CollapsibleSection-Content">
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

export type CollapsibleSectionType = typeof CollapsibleSection;
