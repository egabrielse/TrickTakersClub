import { ThemeProvider } from "@mui/material/styles";
import { BrowserView, MobileView } from "react-device-detect";
import { Provider } from "react-redux";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { theme } from "../constants/mui";
import { PATHS } from "../constants/url";
import { store } from "../store";
import { DeviceNotSupportedError } from "../types/error";
import HeaderLayout from "./layout/HeaderLayout";
import RootLayout from "./layout/RootLayout";
import RulesPage from "./pages//rules/RulesPage";
import AccountPage from "./pages/account/AccountPage";
import AuthenticatedRouter from "./pages/auth/AuthenticatedRouter";
import AuthProvider from "./pages/auth/AuthProvider";
import LoginPage from "./pages/auth/LoginPage";
import PrivateRoutes from "./pages/auth/PrivateRoutes";
import RegisterPage from "./pages/auth/RegisterPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import BrowserPage from "./pages/browser/BrowserPage";
import ErrorBoundary from "./pages/error/ErrorBoundary";
import ErrorPage from "./pages/error/ErrorPage";
import GamePage from "./pages/game/GamePage";
import SessionProvider from "./pages/game/SessionProvider";
import HomePage from "./pages/home/HomePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<ErrorBoundary />}>
      <Route element={<HeaderLayout />}>
        <Route index element={<HomePage />} />
        <Route path={PATHS.HOME} element={<HomePage />} />
        <Route path={PATHS.RULES} element={<RulesPage />} />

        <Route element={<PrivateRoutes />}>
          <Route path={PATHS.BROWSER} element={<BrowserPage />} />
          <Route path={PATHS.ACCOUNT} element={<AccountPage />} />
        </Route>

        <Route element={<AuthenticatedRouter />}>
          <Route path={PATHS.LOGIN} element={<LoginPage />} />
          <Route path={PATHS.REGISTER} element={<RegisterPage />} />
          <Route path={PATHS.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route
          path={PATHS.SESSION}
          element={
            <SessionProvider>
              <GamePage />
            </SessionProvider>
          }
        />
      </Route>
    </Route>,
  ),
);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <MobileView>
        <ErrorPage error={new DeviceNotSupportedError()} />
      </MobileView>
      <BrowserView>
        <Provider store={store}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </Provider>
      </BrowserView>
    </ThemeProvider>
  );
}
