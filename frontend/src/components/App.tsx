import axios from "axios";
import { Provider } from "react-redux";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { PATHS } from "../constants/url";
import { store } from "../redux/store";
import RootLayout from "./layout/RootLayout";
import RulesPage from "./pages//rules/RulesPage";
import AccountPage from "./pages/account/AccountPage";
import AuthContextProvider from "./pages/auth/AuthContextProvider";
import PrivateRoutes from "./pages/auth/PrivateRoutes";
import ErrorPage from "./pages/error/ErrorPage";
import HomePage from "./pages/home/HomePage";
import TablePage from "./pages/table/TablePage";
import TablePageWrapper from "./pages/table/TablePageWrapper";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
      <Route index element={<HomePage />} />
      <Route path={PATHS.HOME} element={<HomePage />} />
      <Route path={PATHS.RULES} element={<RulesPage />} />
      <Route element={<PrivateRoutes />}>
        <Route path={PATHS.ACCOUNT} element={<AccountPage />} />
        <Route
          path={PATHS.TABLE}
          element={
            <TablePageWrapper>
              <TablePage />
            </TablePageWrapper>
          }
        />
      </Route>
    </Route>,
  ),
);

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_HOST;

export default function App() {
  return (
    <Provider store={store}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </Provider>
  );
}
