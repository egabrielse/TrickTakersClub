import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { HandSummary } from "../../../../../types/game";
import ProfileSnapshot from "../../../../common/ProfileSnapshot";
import StyledNumber from "../../../../common/StyledNumber";
import RoleChip from "../Seating/RoleChip";

type ScoresTableProps = {
  summary: HandSummary;
};

export default function ScoresTable({ summary }: ScoresTableProps) {
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
          {Object.entries(summary.playerSummaries).map(([key, playerSum]) => (
            <TableRow>
              <TableCell>
                <ProfileSnapshot variant="avatar" uid={key} />
              </TableCell>
              <TableCell>
                <RoleChip
                  role={
                    summary.pickerId === key
                      ? "picker"
                      : summary.partnerId === key
                        ? "partner"
                        : "opponent"
                  }
                />
              </TableCell>
              <TableCell>{playerSum.tricks}</TableCell>
              <TableCell>{playerSum.points}</TableCell>
              <TableCell>
                <StyledNumber value={playerSum.score} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
