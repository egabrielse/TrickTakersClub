import { useAppSelector } from "../../../../store/hooks";
import gameSlice from "../../../../store/slices/game.slice";
import ProfileSnapshot from "../../../common/ProfileSnapshot";
import StyledNumber from "../../../common/StyledNumber";
import "./ScoreboardDisplay.scss";

export default function ScoreboardDisplay() {
  const scoreboard = useAppSelector(gameSlice.selectors.scoreboard);
  return (
    <div id="scoreboard-display" className="ScoreboardDisplay">
      {scoreboard !== null && Object.entries(scoreboard).length > 0 ? (
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
                  <td>
                    <StyledNumber>{score}</StyledNumber>
                  </td>
                  <td>{totalPoints}</td>
                  <td>{totalTricks}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>No scores to display</p>
      )}
    </div>
  );
}
