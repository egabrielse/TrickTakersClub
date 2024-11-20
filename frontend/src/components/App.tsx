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
import AuthProvider from "./pages/auth/AuthProvider";
import PrivateRoutes from "./pages/auth/PrivateRoutes";
import HomePage from "./pages/home/HomePage";
import TableConnectionProvider from "./pages/table/TableConnectionProvider";
import TablePage from "./pages/table/TablePage";
import TableStateProvider from "./pages/table/TableStateProvider";
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
            <TableStateProvider>
              <TableConnectionProvider>
                <TablePage />
              </TableConnectionProvider>
            </TableStateProvider>
          }
        />
      </Route>
    </Route>,
  ),
);

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_HOST;

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
