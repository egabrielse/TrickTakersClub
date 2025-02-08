import handSlice from "../../../../../store/slices/hand.slice";
import { useAppSelector } from "../../../../../store/store";
import ProfileSnapshot from "../../../../common/ProfileSnapshot";
import RoleChip from "./RoleChip";
import "./Seat.scss";

export default function Seat({ playerId }: { playerId: string }) {
  const dealerId = useAppSelector(handSlice.selectors.dealerId);
  const pickerId = useAppSelector(handSlice.selectors.pickerId);
  const partnerId = useAppSelector(handSlice.selectors.partnerId);
  const isDealer = dealerId === playerId;
  const isPicker = pickerId === playerId;
  const isPartner = partnerId === playerId;

  return (
    <div id={`seat-${playerId}`} className="Seat">
      <ProfileSnapshot
        uid={playerId}
        variant="avatar"
        size="xlarge"
        leftBadgeContent={
          isDealer ? <RoleChip role="d" size="small" /> : undefined
        }
        rightBadgeContent={
          isPicker ? (
            <RoleChip role="pi" size="small" />
          ) : isPartner ? (
            <RoleChip role="pa" size="small" />
          ) : undefined
        }
      />
    </div>
  );
}
