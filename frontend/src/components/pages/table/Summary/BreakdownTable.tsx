import { Box, Typography } from "@mui/material";
import { SCORING_METHOD } from "../../../../constants/game";
import { HandSummary } from "../../../../types/game";
import { countCardPoints } from "../../../../utils/card";
import { getTakerId } from "../../../../utils/game";
import PrintedCard from "../../../common/PrintedCard";
import DisplayName from "../../../common/Profile/DisplayName";
import ProfilePic from "../../../common/Profile/ProfilePic";
import ProfileProvider from "../../../common/Profile/ProfileProvider";
import "./BreakdownTable.scss";

type BreakdownTableProps = {
  summary: HandSummary;
};

export default function BreakdownTable({ summary }: BreakdownTableProps) {
  const { pickerId, tricks, bury, scoringMethod } = summary;
  return (
    <div className="BreakdownTable">
      <table style={{ minWidth: 500 }}>
        <thead>
          <tr>
            <th>Trick</th>
            <th>Taker</th>
            <th>Points</th>
            <th>Cards</th>
          </tr>
        </thead>
        <tbody>
          {scoringMethod === SCORING_METHOD.STANDARD && (
            <tr>
              <td>
                <i>bury</i>
              </td>
              <td>
                <Box display="flex" alignItems="center" gap="0.25rem">
                  <ProfileProvider uid={pickerId}>
                    <ProfilePic size="small" />
                    <DisplayName />
                  </ProfileProvider>
                </Box>
              </td>
              <td>
                <Typography variant="h6">
                  {countCardPoints(Object.values(bury))}
                </Typography>
              </td>
              <td>
                {bury.map((card, index) => (
                  <>
                    <PrintedCard
                      key={`summary-${card.rank}-${card.suit}`}
                      rank={card.rank}
                      suit={card.suit}
                    />
                    {index < Object.values(bury).length - 1 && " "}
                  </>
                ))}
              </td>
            </tr>
          )}

          {tricks.map((trick, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <Box display="flex" alignItems="center" gap="0.25rem">
                  <ProfileProvider uid={getTakerId(trick)}>
                    <ProfilePic size="small" />
                    <DisplayName />
                  </ProfileProvider>
                </Box>
              </td>
              <td>
                <Typography variant="h6">
                  {countCardPoints(Object.values(trick.cards))}
                </Typography>
              </td>
              <td>
                <Box
                  display="flex"
                  gap={1}
                  width="100%"
                  alignContent={"space-around"}
                  justifyContent="space-evenly"
                >
                  {trick.turnOrder.map((playerId) => {
                    const card = trick.cards[playerId];
                    return (
                      <Box
                        display="flex"
                        flexDirection="row"
                        key={`summary-${card.rank}-${card.suit}`}
                      >
                        <ProfileProvider uid={playerId}>
                          <ProfilePic size="small" />
                        </ProfileProvider>
                        <PrintedCard rank={card.rank} suit={card.suit} />
                      </Box>
                    );
                  })}
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
