import { Box } from "@mui/material";
import { SCORING_METHOD } from "../../../../constants/game";
import { HandSummary, Scoreboard } from "../../../../types/game";
import DisplayName from "../../../common/Profile/DisplayName";
import ProfilePic from "../../../common/Profile/ProfilePic";
import ProfileProvider from "../../../common/Profile/ProfileProvider";
import StyledNumber from "../../../common/StyledNumber";
import RoleFlare from "../OverlayComponents/RoleFlare";
import "./ScoresTable.scss";

type ScoresTableProps = {
  scoreboard: Scoreboard;
  summary: HandSummary;
};

export default function ScoresTable({ scoreboard, summary }: ScoresTableProps) {
  const { pickerId, partnerId, payouts, scoringMethod, tricksWon, pointsWon } =
    summary;
  return (
    <div className="ScoresTable">
      <table>
        <thead style={{ border: "1px solid white" }}>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            {scoringMethod === SCORING_METHOD.STANDARD ? (
              <th>Role</th>
            ) : (
              <>
                <th>Tricks Won</th>
                <th>Points Won</th>
              </>
            )}
            <th>Payout</th>
            <th>New Score</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(scoreboard.rows)
            // Sort by payout amounts
            .sort(([a], [b]) => payouts[b] - payouts[a])
            .map(([playerId, row], index) => (
              <tr key={playerId}>
                <td>{index + 1}</td>
                <td>
                  <Box display="flex" alignItems="center" gap="0.25rem">
                    <ProfileProvider uid={playerId}>
                      <ProfilePic size="small" />
                      <DisplayName />
                    </ProfileProvider>
                  </Box>
                </td>
                {scoringMethod === SCORING_METHOD.STANDARD ? (
                  <td>
                    {pickerId === playerId && <RoleFlare role="picker" />}
                    {partnerId === playerId && <RoleFlare role="partner" />}
                  </td>
                ) : (
                  <>
                    <td>{tricksWon[playerId]}</td>
                    <td>{pointsWon[playerId]}</td>
                  </>
                )}
                <td>
                  <StyledNumber variant="h6">{payouts[playerId]}</StyledNumber>
                </td>
                <td>{row.score}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
