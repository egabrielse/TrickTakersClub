import { useAppSelector } from "../../../store/hooks";
import sessionSlice from "../../../store/slices/session.slice";

export default function GamePage() {
  const sessionId = useAppSelector(sessionSlice.selectors.sessionId);
  const presence = useAppSelector(sessionSlice.selectors.presence);
  return (
    <div>
      <h1>Game Page: {sessionId}</h1>
      <p>This is the game page where players can join and play games.</p>
      <h2>Current Players:</h2>
      <ul>
        {presence.map((playerId) => (
          <li key={playerId}>{playerId}</li>
        ))}
      </ul>
    </div>
  );
}
