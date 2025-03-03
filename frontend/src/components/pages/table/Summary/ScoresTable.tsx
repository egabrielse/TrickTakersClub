import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { HandSummary } from "../../../../types/game";
import ProfileSnapshot from "../../../common/ProfileSnapshot";
import StyledNumber from "../../../common/StyledNumber";

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
      <Table sx={{ minWidth: 500 }} size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Tricks</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playerIds.map((playerId) => (
            <TableRow>
              <TableCell>
                <ProfileSnapshot variant="avatar" uid={playerId} />
              </TableCell>
              <TableCell>
                {summary.pickerId === playerId
                  ? "Picker"
                  : summary.partnerId === playerId
                    ? "Partner"
                    : null}
              </TableCell>
              <TableCell>{summary.tricksWon[playerId]}</TableCell>
              <TableCell>{summary.pointsWon[playerId]}</TableCell>
              <TableCell>
                <StyledNumber>{summary.scores[playerId]}</StyledNumber>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
