import ProfileSnapshot from "../../../common/ProfileSnapshot";
import "./Seat.scss";

export default function Seat({ playerId }: { playerId: string }) {
  return (
    <div id={`seat-${playerId}`} className="Seat">
      <ProfileSnapshot uid={playerId} variant="avatar" size="medium" />
    </div>
  );
}
