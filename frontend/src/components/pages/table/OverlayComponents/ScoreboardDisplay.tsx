import { Box } from "@mui/material";
import { Scoreboard } from "../../../../types/game";
import DisplayName from "../../../common/Profile/DisplayName";
import ProfilePic from "../../../common/Profile/ProfilePic";
import ProfileProvider from "../../../common/Profile/ProfileProvider";
import StyledNumber from "../../../common/StyledNumber";
import "./ScoreboardDisplay.scss";

type ScoreboardDisplayProps = {
  scoreboard: Scoreboard;
  namesExpanded?: boolean;
};

export default function ScoreboardDisplay({
  scoreboard,
  namesExpanded = false,
}: ScoreboardDisplayProps) {
  const { rows, handsPlayed } = scoreboard;
  return (
    <div id="scoreboard-display" className="ScoreboardDisplay">
      {scoreboard !== null && Object.entries(scoreboard).length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Score</th>
              <th>Hands Won</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rows)
              .sort(([, a], [, b]) => b.score - a.score)
              .map(([playerId, { score, handsWon }]) => (
                <tr key={`scoreboard-row-${playerId}`}>
                  <td>
                    <Box display="flex" alignItems="center" gap="0.5rem">
                      <ProfileProvider uid={playerId}>
                        <ProfilePic size="small" />
                        {namesExpanded && <DisplayName />}
                      </ProfileProvider>
                    </Box>
                  </td>
                  <td>
                    <StyledNumber>{score}</StyledNumber>
                  </td>
                  <td>{handsWon}</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Total Hands Played: {handsPlayed}</td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p>No scores to display</p>
      )}
    </div>
  );
}
