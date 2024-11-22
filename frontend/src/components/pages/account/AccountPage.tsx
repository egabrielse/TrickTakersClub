import { useContext } from "react";
import { UserStoreContext } from "../../providers/UserStoreProvider";
import { AuthContext } from "../auth/AuthContextProvider";
import "./AccountPage.scss";

export default function AccountPage() {
  const { user } = useContext(AuthContext);
  const { useCachedUser } = useContext(UserStoreContext);
  const record = useCachedUser(user!.uid);
  return (
    <div className="AccountPage">
      <div>{record.status}</div>
      {record.status === "loaded" && (
        <div>
          <div>{record.user?.displayName}</div>
          <div>{record.user?.email}</div>
        </div>
      )}
    </div>
  );
}
