import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AvatarGroup, Box, Tab, Typography } from "@mui/material";
import { useState } from "react";
import { SCORING_METHOD } from "../../../constants/game";
import { HandSummaryDialogParams } from "../../../types/dialog";
import DisplayName from "../../common/Profile/DisplayName";
import ProfilePic from "../../common/Profile/ProfilePic";
import ProfileProvider from "../../common/Profile/ProfileProvider";
import RoleFlare from "../../pages/game/OverlayComponents/RoleFlare";
import BreakdownTable from "../../pages/game/Summary/BreakdownTable";
import ScoresTable from "../../pages/game/Summary/ScoresTable";
import CloseDialogButton from "../components/CloseDialogButton";
import DialogBody from "../components/DialogBody";
import DialogHeader from "../components/DialogHeader";

const PANELS = {
  SUMMARY: "summary",
  DETAILS: "details",
} as const;

export default function HandSummaryDialog({ props }: HandSummaryDialogParams) {
  const { scoreboard, summary } = props;
  const {
    pickerId,
    partnerId,
    scoringMethod,
    tricksWon,
    pointsWon,
    opponentIds,
    winners,
  } = summary;
  const [openedPanel, setOpenedPanel] = useState<string>(PANELS.SUMMARY);
  const [pickingTeamPoints] = useState<number>(
    pointsWon[pickerId] + (partnerId ? pointsWon[partnerId] : 0),
  );
  const [opponentPoints] = useState<number>(
    opponentIds.reduce((acc, playerId) => acc + pointsWon[playerId], 0),
  );

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setOpenedPanel(newValue);
  };

  const summarySentence = () => {
    if (scoringMethod === SCORING_METHOD.STANDARD) {
      if (winners.includes(pickerId)) {
        if (partnerId) {
          return `Picking Team Won with ${pickingTeamPoints} Points!`;
        } else {
          return `Picker Won with ${pickingTeamPoints} Points!`;
        }
      } else {
        return `Opponents Won with ${opponentPoints} Points`;
      }
    } else {
      // There can only be one winner/loser in leasters and mosters
      const winner = winners[0];
      if (winners.length === 0) {
        return "Draw! No points are exchanged.";
      }
      const tricks = tricksWon[winner];
      const points = pointsWon[winner];
      if (scoringMethod === SCORING_METHOD.LEASTERS) {
        return (
          <>
            <ProfileProvider uid={winner}>
              <DisplayName />
            </ProfileProvider>
            &nbsp;Won by Taking {tricks} Trick{tricks > 1 && "s"} and&nbsp;
            {points} Point{points > 1 && "s"}!
          </>
        );
      } else {
        return (
          <>
            <ProfileProvider uid={winner}>
              <DisplayName />
            </ProfileProvider>
            &nbsp;Lost by Taking ${tricks} Trick{tricks > 1 && "s"} and&nbsp;
            {points} Point{points > 1 && "s"}...
          </>
        );
      }
    }
  };

  return (
    <>
      <CloseDialogButton />
      <DialogHeader>
        {scoringMethod === SCORING_METHOD.STANDARD ? (
          winners.includes(pickerId) ? (
            <Box display="flex" alignItems="center" gap="1rem" fontSize={12}>
              <ProfileProvider uid={pickerId}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap="0.25rem"
                >
                  <ProfilePic size="xlarge" />
                  {partnerId && <RoleFlare role="picker" />}
                </Box>
              </ProfileProvider>
              {partnerId && (
                <ProfileProvider uid={partnerId}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap="0.25rem"
                  >
                    <ProfilePic size="xlarge" />
                    <RoleFlare role="partner" />
                  </Box>
                </ProfileProvider>
              )}
            </Box>
          ) : (
            <AvatarGroup>
              {opponentIds.map((playerId) => (
                <ProfileProvider key={playerId} uid={playerId}>
                  <ProfilePic size="xlarge" />
                </ProfileProvider>
              ))}
            </AvatarGroup>
          )
        ) : winners.length === 1 ? (
          <ProfileProvider uid={winners[0]}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="0.25rem"
            >
              <ProfilePic size="xlarge" />
              {partnerId && <RoleFlare role="picker" />}
            </Box>
          </ProfileProvider>
        ) : (
          <div id="draw-spacer" />
        )}
        <Typography
          variant="overline"
          fontSize="1rem"
          maxWidth={"75%"}
          textAlign="center"
        >
          {summarySentence()}
        </Typography>
      </DialogHeader>
      <DialogBody>
        <TabContext value={openedPanel}>
          <TabList onChange={handleChange}>
            <Tab label={PANELS.SUMMARY} value={PANELS.SUMMARY} />
            <Tab label={PANELS.DETAILS} value={PANELS.DETAILS} />
          </TabList>
          <TabPanel value={PANELS.SUMMARY} sx={{ padding: 0 }}>
            <ScoresTable scoreboard={scoreboard} summary={summary} />
          </TabPanel>
          <TabPanel value={PANELS.DETAILS} sx={{ padding: 0 }}>
            <BreakdownTable summary={summary} />
          </TabPanel>
        </TabContext>
      </DialogBody>
    </>
  );
}
