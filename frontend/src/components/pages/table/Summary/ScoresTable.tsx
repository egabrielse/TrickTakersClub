import { Box } from "@mui/material";
import { HandSummary, Scoreboard } from "../../../../types/game";
import DisplayName from "../../../common/Profile/DisplayName";
import ProfilePic from "../../../common/Profile/ProfilePic";
import ProfileProvider from "../../../common/Profile/ProfileProvider";
import StyledNumber from "../../../common/StyledNumber";
import NameBadge from "../OverlayComponents/NameBadge";
import "./ScoresTable.scss";

type ScoresTableProps = {
  scoreboard: Scoreboard;
  summary: HandSummary;
};

export default function ScoresTable({ scoreboard, summary }: ScoresTableProps) {
  const { rows } = scoreboard;
  const playerIds = [summary.pickerId];
  if (summary.partnerId) {
    playerIds.push(summary.partnerId);
  }
  playerIds.push(...summary.opponentIds);
  return (
    <div className="ScoresTable">
      <table>
        <thead style={{ border: "1px solid white" }}>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Role</th>
            <th>Payout</th>
            <th>New Score</th>
          </tr>
        </thead>
        <tbody>
          {playerIds
            .sort((a, b) => rows[b].score - rows[a].score)
            .map((playerId, index) => (
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
                <td style={{ fontSize: "0.75rem" }}>
                  {summary.pickerId === playerId && (
                    <NameBadge color="blue">Picker</NameBadge>
                  )}
                  {summary.partnerId === playerId && (
                    <NameBadge color="purple">Partner</NameBadge>
                  )}
                </td>
                <td>
                  <StyledNumber variant="h6">
                    {summary.payouts[playerId]}
                  </StyledNumber>
                </td>
                <td>{rows[playerId].score}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
