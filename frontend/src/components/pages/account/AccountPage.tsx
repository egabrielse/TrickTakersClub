import authSlice from "../../../store/slices/auth.slice";
import { useAppSelector } from "../../../store/store";
import ProfileSnapshot from "../../common/ProfileSnapshot";
import "./AccountPage.scss";

export default function AccountPage() {
  const uid = useAppSelector(authSlice.selectors.uid);
  const email = useAppSelector(authSlice.selectors.email);

  return (
    <div className="AccountPage">
      <ProfileSnapshot uid={uid} variant="name-column" size="xlarge" />
      <div>{email}</div>
    </div>
  );
}
