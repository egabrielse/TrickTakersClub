import { UserInfo } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { fetchUserInfoById } from "../../api/user.api";

type CachedUser = {
  user: UserInfo | undefined;
  status: "loading" | "loaded" | "error";
};

type UserCache = {
  [key: string]: CachedUser;
};

type UserStoreProviderProps = {
  children: ReactNode;
};

export const UserStoreContext = createContext<{
  useCachedUser: (id: string) => CachedUser;
  refreshUser: (id: string) => void;
}>({
  useCachedUser: () => ({ user: undefined, status: "loading" }),
  refreshUser: () => {},
});

/**
 * Provides a global store for caching user info.
 */
export default function UserStoreProvider({
  children,
}: UserStoreProviderProps) {
  const [userCache, setUserCache] = useState<UserCache>({});

  /**
   * Fetch user info by id and cache it in the store.
   */
  const asyncFetchUser = useCallback((id: string) => {
    setUserCache((prev) => ({
      ...prev,
      [id]: { user: undefined, status: "loading" },
    }));
    fetchUserInfoById(id)
      .then((response) => {
        const { user } = response;
        setUserCache((prev) => ({
          ...prev,
          [id]: { user, status: user ? "loaded" : "error" },
        }));
      })
      .catch(() => {
        setUserCache((prev) => ({
          ...prev,
          [id]: { user: undefined, status: "error" },
        }));
      });
  }, []);

  /**
   * Force refresh user info by id.
   */
  const refreshUser = useCallback(
    (id: string) => {
      asyncFetchUser(id);
    },
    [asyncFetchUser],
  );

  /**
   * Hook to fetch user info by id and cache it in the store.
   * @param id user id
   * @returns record of user info and fetch status
   */
  const useCachedUser = (id: string): CachedUser => {
    const record = userCache[id];
    useEffect(() => {
      if (!record) asyncFetchUser(id);
    }, [id, record]);
    return {
      user: record?.user,
      status: record?.status,
    };
  };

  return (
    <UserStoreContext.Provider value={{ useCachedUser, refreshUser }}>
      {children}
    </UserStoreContext.Provider>
  );
}
