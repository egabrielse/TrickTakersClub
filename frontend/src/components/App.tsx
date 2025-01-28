import axios from "axios";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { PATHS } from "../constants/url";
import RulesPage from "./pages//rules/RulesPage";
import AccountPage from "./pages/account/AccountPage";
import AuthContextProvider from "./pages/auth/AuthContextProvider";
import PrivateRoutes from "./pages/auth/PrivateRoutes";
import HomePage from "./pages/home/HomePage";
import ChannelContextProvider from "./pages/table/ChannelContextProvider";
import TablePage from "./pages/table/TablePage";
import TableStateProvider from "./pages/table/TableStateProvider";
import MuiThemeProvider from "./providers/MuiThemeProvider";
import UserStoreProvider from "./providers/UserStoreProvider";
import RootLayout from "./root/RootLayout";

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
            <ChannelContextProvider>
              <TableStateProvider>
                <TablePage />
              </TableStateProvider>
            </ChannelContextProvider>
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
      <AuthContextProvider>
        <UserStoreProvider>
          <RouterProvider router={router} />
        </UserStoreProvider>
      </AuthContextProvider>
    </MuiThemeProvider>
  );
}
