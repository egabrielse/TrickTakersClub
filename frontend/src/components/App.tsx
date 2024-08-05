import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import axios from "axios";
import { Provider } from "react-redux";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { PATHS } from "../constants/url";
import FirebaseAuthProvider from "../firebase/FirebaseAuthProvider";
import { store } from "../redux/store";
import RootLayout from "./layout/RootLayout";
import RulesPage from "./pages//rules/RulesPage";
import AboutPage from "./pages/AboutPage";
import AccountPage from "./pages/AccountPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import PrivateRoutes from "./pages/PrivateRoutes";
import PublicRoutes from "./pages/PublicRoutes";
import RootErrorBoundary from "./pages/error/RootErrorBoundary";
import HomePage from "./pages/home/HomePage";
import TablePage from "./pages/table/TablePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<RootLayout />}
      errorElement={<RootErrorBoundary />}
    >
      <Route element={<PublicRoutes />}>
        <Route index element={<HomePage />} />
        <Route path={PATHS.HOME} element={<HomePage />} />
        <Route path={PATHS.LEADERBOARD} element={<LeaderboardPage />} />
        <Route path={PATHS.RULES} element={<RulesPage />} />
        <Route path={PATHS.ABOUT} element={<AboutPage />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route path={PATHS.ACCOUNT} element={<AccountPage />} />
        <Route path={PATHS.TABLE} element={<TablePage />} />
      </Route>
    </Route>,
  ),
);

const theme = createTheme({
  palette: {
    primary: {
      main: "#0C4767",
      light: "#2187AD",
    },
    secondary: {
      main: "#795C32",
      light: "#A68C6B",
    },
    background: {
      default: "#006400",
    },
  },
});

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_HOST;

export default function App() {
  return (
    <Provider store={store}>
      <FirebaseAuthProvider>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </FirebaseAuthProvider>
    </Provider>
  );
}
