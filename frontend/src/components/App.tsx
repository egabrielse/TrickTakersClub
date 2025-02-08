import axios from "axios";
import { Provider } from "react-redux";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { PATHS } from "../constants/url";
import { store } from "../store/store";
import RulesPage from "./pages//rules/RulesPage";
import AccountPage from "./pages/account/AccountPage";
import AuthContextProvider from "./pages/auth/AuthContextProvider";
import PrivateRoutes from "./pages/auth/PrivateRoutes";
import HomePage from "./pages/home/HomePage";
import RootLayout from "./pages/root/RootLayout";
import ConnectionProvider from "./pages/table/ConnectionProvider";
import TablePage from "./pages/table/TablePage";
import MuiThemeProvider from "./providers/MuiThemeProvider";
import UserStoreProvider from "./providers/UserStoreProvider";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path={PATHS.HOME} element={<HomePage />} />
      <Route path={PATHS.RULES} element={<RulesPage />} />
      <Route element={<PrivateRoutes />}>
        <Route path={PATHS.ACCOUNT} element={<AccountPage />} />
        <Route
          path={PATHS.TABLE}
          element={
            <ConnectionProvider>
              <TablePage />
            </ConnectionProvider>
          }
        />
      </Route>
    </Route>,
  ),
);

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_HOST;

export default function App() {
  return (
    <MuiThemeProvider>
      <Provider store={store}>
        <AuthContextProvider>
          <UserStoreProvider>
            <RouterProvider router={router} />
          </UserStoreProvider>
        </AuthContextProvider>
      </Provider>
    </MuiThemeProvider>
  );
}
