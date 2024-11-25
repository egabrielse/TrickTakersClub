import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import PaperButton from "../../common/PaperButton";

type LinkButtonProps = {
  tableId: string;
};
export default function LinkButton({ tableId }: LinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const link = `${window.location.origin}/table/${tableId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    // reset the copied state after 3 seconds
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Tooltip title={copied ? "Copied!" : "Copy link to table"} placement="left">
      <PaperButton
        id="link-button"
        name="link-button"
        startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
        onClick={copyLink}
      >
        {tableId}
      </PaperButton>
    </Tooltip>
  );
}
