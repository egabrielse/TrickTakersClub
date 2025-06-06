import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button, Tooltip } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../../../../store/hooks";
import tableSlice from "../../../../store/slices/table.slice";
import PaperButton from "../../../common/PaperButton";

type LinkButtonProps = {
  variant?: "default" | "paper";
};

export default function LinkButton({ variant = "default" }: LinkButtonProps) {
  const tableId = useAppSelector(tableSlice.selectors.tableId);
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(tableId);
    setCopied(true);
    // reset the copied state after 3 seconds
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Tooltip title={copied ? "Copied!" : "Copy link to table"}>
      <>
        {variant === "paper" ? (
          <PaperButton
            id="paper-link-button"
            name="paper-link-button"
            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            onClick={copyLink}
          >
            Invite Code
          </PaperButton>
        ) : (
          <Button
            id="link-button"
            name="link-button"
            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            onClick={copyLink}
            style={{ fontSize: "0.75rem" }}
            color="secondary"
          >
            Copy Invite Code
          </Button>
        )}
      </>
    </Tooltip>
  );
}
