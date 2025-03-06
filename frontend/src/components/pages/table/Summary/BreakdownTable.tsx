import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { HandSummary } from "../../../../types/game";
import { countCardPoints } from "../../../../utils/card";
import { getTakerId } from "../../../../utils/game";
import PlayingCard from "../../../common/PlayingCard";
import PlayingCardList from "../../../common/PlayingCardList";
import ProfilePic from "../../../common/Profile/ProfilePic";
import ProfileProvider from "../../../common/Profile/ProfileProvider";

type BreakdownTableProps = {
  summary: HandSummary;
};

export default function BreakdownTable({ summary }: BreakdownTableProps) {
  return (
    <TableContainer sx={{ maxHeight: 500 }} component={Paper}>
      <Table
        style={{ minWidth: 500 }}
        aria-label="simple table"
        size="medium"
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
              <ProfileProvider uid={summary.pickerId}>
                <ProfilePic />
              </ProfileProvider>
            </TableCell>
            <TableCell>
              <PlayingCardList>
                {summary.bury.map((card) => (
                  <PlayingCard
                    id={`summary-${card.rank}-${card.suit}`}
                    key={`summary-${card.rank}-${card.suit}`}
                    card={card}
                    height={100}
                  />
                ))}
              </PlayingCardList>
            </TableCell>
            <TableCell>
              <Typography variant="h6">
                {countCardPoints(Object.values(summary.bury))}
              </Typography>
            </TableCell>
          </TableRow>
          {summary.tricks.map((trick, index) => (
            <TableRow key={index}>
              <TableCell>
                <ProfileProvider uid={getTakerId(trick)}>
                  <ProfilePic />
                </ProfileProvider>
              </TableCell>
              <TableCell>
                <PlayingCardList>
                  {Object.values(trick.cards).map((card) => (
                    <PlayingCard
                      id={`summary-${card.rank}-${card.suit}`}
                      key={`summary-${card.rank}-${card.suit}`}
                      card={card}
                      height={100}
                    />
                  ))}
                </PlayingCardList>
              </TableCell>
              <TableCell>
                <Typography variant="h6">
                  {countCardPoints(Object.values(trick.cards))}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
