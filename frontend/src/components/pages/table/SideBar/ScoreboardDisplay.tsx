import { Paper } from "@mui/material";
import gameSlice from "../../../../store/slices/game.slice";
import { useAppSelector } from "../../../../store/store";
import ProfileSnapshot from "../../../common/ProfileSnapshot";
import "./ScoreboardDisplay.scss";

export default function ScoreboardDisplay() {
  const scoreboard = useAppSelector(gameSlice.selectors.scoreboard);
  if (scoreboard !== null && Object.entries(scoreboard).length > 0) {
    return (
      <Paper className="ScoreboardDisplay">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Score</th>
              <th>Points</th>
              <th>Tricks</th>
            </tr>
          </thead>
          <tbody>
            {[...scoreboard]
              .sort((a, b) => b.score - a.score)
              .map(({ playerId, score, totalPoints, totalTricks }) => (
                <tr key={`scoreboard-row-${playerId}`}>
                  <td>
                    <ProfileSnapshot
                      size="small"
                      variant="avatar"
                      uid={playerId}
                    />
                  </td>
                  <td>{score}</td>
                  <td>{totalPoints}</td>
                  <td>{totalTricks}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Paper>
    );
  } else {
    return null;
  }
}
