import { useAppSelector } from "../../../../store/hooks";
import gameSlice from "../../../../store/slices/game.slice";
import ProfilePic from "../../../common/Profile/ProfilePic";
import ProfileProvider from "../../../common/Profile/ProfileProvider";
import StyledNumber from "../../../common/StyledNumber";
import "./ScoreboardDisplay.scss";

export default function ScoreboardDisplay() {
  const scoreboard = useAppSelector(gameSlice.selectors.scoreboard);
  const handsPlayed = useAppSelector(gameSlice.selectors.handsPlayed);

  return (
    <div id="scoreboard-display" className="ScoreboardDisplay">
      {scoreboard !== null && Object.entries(scoreboard).length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Score</th>
              <th>Hands Won</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(scoreboard)
              .sort(([, a], [, b]) => b.score - a.score)
              .map(([playerId, { score, handsWon }]) => (
                <tr key={`scoreboard-row-${playerId}`}>
                  <td>
                    <ProfileProvider uid={playerId}>
                      <ProfilePic size="small" />
                    </ProfileProvider>
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
