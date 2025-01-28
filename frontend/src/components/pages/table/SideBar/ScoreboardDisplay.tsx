import { Paper } from "@mui/material";
import { useContext } from "react";
import ProfileSnapshot from "../../../common/ProfileSnapshot";
import { TableState } from "../TableStateProvider";
import "./ScoreboardDisplay.scss";

export default function ScoreboardDisplay() {
  const { scoreboard } = useContext(TableState);
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
            {Object.entries(scoreboard)
              .sort((a, b) => {
                return b[1].score - a[1].score;
              })
              .map(([playerId, row]) => (
                <tr key={`scoreboard-row-${playerId}`}>
                  <td>
                    <ProfileSnapshot
                      size="small"
                      variant="avatar"
                      uid={playerId}
                    />
                  </td>
                  <td>{row.score}</td>
                  <td>{row.totalPoints}</td>
                  <td>{row.totalTricks}</td>
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
