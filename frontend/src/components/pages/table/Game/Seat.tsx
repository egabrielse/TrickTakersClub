import "./Seat.scss";

export default function Seat({ playerId }: { playerId: string }) {
  return <div id={`seat-${playerId}`} className="Seat" />;
}
