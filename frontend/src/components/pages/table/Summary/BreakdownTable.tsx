import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { HandSummary } from "../../../../types/game";
import { countCardPoints } from "../../../../utils/card";
import { getTakerId } from "../../../../utils/game";
import PlayingCard from "../../../common/PlayingCard";
import ProfileSnapshot from "../../../common/ProfileSnapshot";

type BreakdownTableProps = {
  summary: HandSummary;
};

export default function BreakdownTable({ summary }: BreakdownTableProps) {
  console.log(summary);
  summary.tricks.forEach((trick) => {
    console.log(getTakerId(trick));
  });
  return (
    <TableContainer sx={{ maxHeight: 500 }} component={Paper}>
      <Table
        sx={{ minWidth: 500 }}
        aria-label="simple table"
        size="small"
        stickyHeader
      >
        <TableHead>
          <TableRow>
            <TableCell>Taker</TableCell>
            <TableCell>Cards</TableCell>
            <TableCell>Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <ProfileSnapshot variant="avatar" uid={summary.pickerId} />
            </TableCell>
            <TableCell style={{ display: "flex" }}>
              {summary.bury.map((card) => (
                <PlayingCard
                  id={`summary-${card.rank}-${card.suit}`}
                  key={`summary-${card.rank}-${card.suit}`}
                  card={card}
                  size="small"
                />
              ))}
            </TableCell>
            <TableCell>{countCardPoints(summary.bury)}</TableCell>
          </TableRow>
          {summary.tricks.map((trick, index) => (
            <TableRow key={index}>
              <TableCell>
                <ProfileSnapshot variant="avatar" uid={getTakerId(trick)} />
              </TableCell>
              <TableCell style={{ display: "flex" }}>
                {Object.values(trick.cards).map((card) => (
                  <PlayingCard
                    id={`summary-${card.rank}-${card.suit}`}
                    key={`summary-${card.rank}-${card.suit}`}
                    card={card}
                    size="small"
                  />
                ))}
              </TableCell>
              <TableCell>
                {countCardPoints(Object.values(trick.cards))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
