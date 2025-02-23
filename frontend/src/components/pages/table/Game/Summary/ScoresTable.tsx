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
          {Object.entries(summary.playerSummaries)
            .sort(([key]) => {
              if (summary.pickerId === key) {
                return -1;
              } else if (summary.partnerId === key) {
                return -1;
              } else {
                return 1;
              }
            })
            .map(([key, playerSum]) => (
              <TableRow>
                <TableCell>
                  <ProfileSnapshot variant="avatar" uid={key} />
                </TableCell>
                <TableCell>
                  {summary.pickerId === key
                    ? "Picker"
                    : summary.partnerId === key
                      ? "Partner"
                      : null}
                </TableCell>
                <TableCell>{playerSum.tricks}</TableCell>
                <TableCell>{playerSum.points}</TableCell>
                <TableCell>
                  <StyledNumber>{playerSum.score}</StyledNumber>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
