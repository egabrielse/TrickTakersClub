import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  AvatarGroup,
  Box,
  Tab,
  TableContainer,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { GameSummaryDialogParams } from "../../../types/dialog";
import ProfileSnapshot from "../../common/ProfileSnapshot";
import BreakdownTable from "../../pages/table/Summary/BreakdownTable";
import ScoresTable from "../../pages/table/Summary/ScoresTable";
import CloseDialogButton from "../components/CloseDialogButton";
import DialogBody from "../components/DialogBody";
import DialogHeader from "../components/DialogHeader";

const PANELS = {
  SUMMARY: "summary",
  DETAILS: "details",
} as const;

export default function GameSummaryDialog({ props }: GameSummaryDialogParams) {
  const { summary } = props;
  const [openedPanel, setOpenedPanel] = useState<string>(PANELS.SUMMARY);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setOpenedPanel(newValue);
  };

  return (
    <>
      <CloseDialogButton />
      <DialogHeader>
        {summary.winners.includes(summary.pickerId) ? (
          <>
            <ProfileSnapshot
              uid={summary.pickerId}
              variant="avatar"
              size="large"
              rightBadgeContent={
                summary.partnerId ? (
                  <ProfileSnapshot
                    uid={summary.partnerId}
                    variant="avatar"
                    size="small"
                  />
                ) : undefined
              }
            />
            <Typography variant="overline" fontSize="1rem">
              Picker Won!
            </Typography>
          </>
        ) : (
          <>
            <AvatarGroup>
              {summary.opponentIds.map((playerId) => (
                <ProfileSnapshot
                  key={playerId}
                  uid={playerId}
                  variant="avatar"
                  size="large"
                />
              ))}
            </AvatarGroup>
            <Typography variant="overline" fontSize="1rem">
              Opponents Won!
            </Typography>
          </>
        )}
      </DialogHeader>
      <DialogBody>
        <TabContext value={openedPanel}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange}>
              <Tab label={PANELS.SUMMARY} value={PANELS.SUMMARY} />
              <Tab label={PANELS.DETAILS} value={PANELS.DETAILS} />
            </TabList>
          </Box>
          <TabPanel value={PANELS.SUMMARY} sx={{ padding: 0 }}>
            <ScoresTable summary={summary} />
          </TabPanel>
          <TabPanel value={PANELS.DETAILS} sx={{ padding: 0 }}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <BreakdownTable summary={summary} />
            </TableContainer>
          </TabPanel>
        </TabContext>
      </DialogBody>
    </>
  );
}
