import { useAppSelector } from "../../../../store/hooks";
import handSlice from "../../../../store/slices/hand.slice";
import tableSlice from "../../../../store/slices/table.slice";
import DisplayName from "../../../common/Profile/DisplayName";
import ProfilePic from "../../../common/Profile/ProfilePic";
import ProfileProvider from "../../../common/Profile/ProfileProvider";
import NameBadge from "./NameBadge";
import "./NameTag.scss";

type NameTagProps = {
  playerId: string;
};

export default function NameTag({ playerId }: NameTagProps) {
  const hostId = useAppSelector(tableSlice.selectors.hostId);
  const dealerId = useAppSelector(handSlice.selectors.dealerId);
  const pickerId = useAppSelector(handSlice.selectors.pickerId);
  const partnerId = useAppSelector(handSlice.selectors.partnerId);

  return (
    <ProfileProvider uid={playerId}>
      <div id={`name-tag-${playerId}`} className="NameTag">
        <ProfilePic size="medium" />
        <div className="NameTag-Name">
          <DisplayName fontSize={16} fontWeight="bolder" />
          <div className="NameTag-Name-Badges">
            {hostId === playerId && <NameBadge role="host" />}
            {dealerId === playerId && <NameBadge role="dealer" />}
            {pickerId === playerId && <NameBadge role="picker" />}
            {partnerId === playerId && <NameBadge role="partner" />}
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
}
