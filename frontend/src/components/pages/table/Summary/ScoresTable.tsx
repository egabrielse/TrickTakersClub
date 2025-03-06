import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { HandSummary } from "../../../../types/game";
import ProfilePic from "../../../common/Profile/ProfilePic";
import ProfileProvider from "../../../common/Profile/ProfileProvider";
import StyledNumber from "../../../common/StyledNumber";
import NameBadge from "../OverlayComponents/NameBadge";

type ScoresTableProps = {
  summary: HandSummary;
};

export default function ScoresTable({ summary }: ScoresTableProps) {
  const playerIds = [summary.pickerId];
  if (summary.partnerId) {
    playerIds.push(summary.partnerId);
  }
  playerIds.push(...summary.opponentIds);
  return (
    <TableContainer sx={{ maxHeight: 500 }} component={Paper}>
      <Table sx={{ minWidth: 500 }} size="medium" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell>Tricks</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playerIds.map((playerId) => (
            <TableRow>
              <TableCell>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  fontSize={10}
                  gap="0.25rem"
                >
                  <ProfileProvider uid={playerId}>
                    <ProfilePic size="small" />
                  </ProfileProvider>
                  {summary.pickerId === playerId && (
                    <NameBadge color="blue">Picker</NameBadge>
                  )}
                  {summary.partnerId === playerId && (
                    <NameBadge color="purple">Partner</NameBadge>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="h6">
                  {summary.tricksWon[playerId]}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">
                  {summary.pointsWon[playerId]}
                </Typography>
              </TableCell>
              <TableCell>
                <StyledNumber variant="h6">
                  {summary.scores[playerId]}
                </StyledNumber>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
