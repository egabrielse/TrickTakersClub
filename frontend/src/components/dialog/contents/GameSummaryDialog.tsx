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
import ProfilePic from "../../common/Profile/ProfilePic";
import ProfileProvider from "../../common/Profile/ProfileProvider";
import NameBadge from "../../pages/table/OverlayComponents/NameBadge";
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
            <Box display="flex" alignItems="center" gap="1rem" fontSize={12}>
              <ProfileProvider uid={summary.pickerId}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap="0.25rem"
                >
                  <ProfilePic size="large" />
                  {summary.partnerId && (
                    <NameBadge color="blue">PICKER</NameBadge>
                  )}
                </Box>
              </ProfileProvider>
              {summary.partnerId && (
                <ProfileProvider uid={summary.partnerId}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap="0.25rem"
                  >
                    <ProfilePic size="large" />
                    <NameBadge color="purple">PARTNER</NameBadge>
                  </Box>
                </ProfileProvider>
              )}
            </Box>
            <Typography variant="overline" fontSize="1rem">
              {summary.partnerId ? "Picking Team Won!" : "Picker Won!"}
            </Typography>
          </>
        ) : (
          <>
            <AvatarGroup>
              {summary.opponentIds.map((playerId) => (
                <ProfileProvider key={playerId} uid={playerId}>
                  <ProfilePic size="large" />
                </ProfileProvider>
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
          <TabList onChange={handleChange}>
            <Tab label={PANELS.SUMMARY} value={PANELS.SUMMARY} />
            <Tab label={PANELS.DETAILS} value={PANELS.DETAILS} />
          </TabList>
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
