import { useAppSelector } from "../../../../store/hooks";
import handSlice from "../../../../store/slices/hand.slice";
import tableSlice from "../../../../store/slices/table.slice";
import Flare from "../../../common/Flare";
import PrintedCard from "../../../common/PrintedCard";
import DisplayName from "../../../common/Profile/DisplayName";
import ProfilePic from "../../../common/Profile/ProfilePic";
import ProfileProvider from "../../../common/Profile/ProfileProvider";
import "./NameTag.scss";
import RoleFlare from "./RoleFlare";

type NameTagProps = {
  playerId: string;
};

export default function NameTag({ playerId }: NameTagProps) {
  const hostId = useAppSelector(tableSlice.selectors.hostId);
  const dealerId = useAppSelector(handSlice.selectors.dealerId);
  const pickerId = useAppSelector(handSlice.selectors.pickerId);
  const partnerId = useAppSelector(handSlice.selectors.partnerId);
  const calledCard = useAppSelector(handSlice.selectors.calledCard);
  const goneAlone = useAppSelector(handSlice.selectors.goneAlone);
  const isHost = playerId === hostId;
  const isDealer = playerId === dealerId;
  const isPicker = playerId === pickerId;
  const isPartner = playerId === partnerId;

  return (
    <ProfileProvider uid={playerId}>
      <div className="NameTag">
        <ProfilePic size="medium" />
        <div className="NameTag-Name">
          <DisplayName />
          {(isHost || isDealer || isPicker || isPartner) && (
            <div className="NameTag-Name-Flares">
              {isHost && <RoleFlare role="host" />}
              {isDealer && <RoleFlare role="dealer" />}
              {isPicker && <RoleFlare role="picker" />}
              {isPartner && <RoleFlare role="partner" />}
              {isPicker && calledCard && (
                <Flare color="purple">
                  CALLED&nbsp;
                  <PrintedCard suit={calledCard.suit} rank={calledCard.rank} />
                </Flare>
              )}
              {isPicker && goneAlone && <Flare color="purple">ALONE</Flare>}
            </div>
          )}
        </div>
      </div>
    </ProfileProvider>
  );
}
