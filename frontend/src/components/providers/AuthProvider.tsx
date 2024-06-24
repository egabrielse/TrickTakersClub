import { onAuthStateChanged } from 'firebase/auth';
import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import authSlice from '../../redux/slices/auth.slice';
import auth from '../../firebase/auth';

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps): ReactNode {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(authSlice.actions.updateUser(user));
    });
    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}
