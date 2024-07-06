import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { Provider } from "react-redux";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { SEGMENTS } from "../constants/url";
import FirebaseAuthProvider from "../firebase/FirebaseAuthProvider";
import { store } from "../redux/store";
import RootLayout from "./layout/RootLayout";
import AccountPage from "./pages/AccountPage";
import PrivateRoutes from "./pages/PrivateRoutes";
import PublicRoutes from "./pages/PublicRoutes";
import RootErrorBoundary from "./pages/RootErrorBoundary";
import RulesPage from "./pages/RulesPage";
import TablePage from "./pages/TablePage";
import HomePage from "./pages/home/HomePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<RootLayout />}
      errorElement={<RootErrorBoundary />}
    >
      <Route element={<PublicRoutes />}>
        <Route index element={<HomePage />} />
        <Route path={SEGMENTS.RULES} element={<RulesPage />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route path={SEGMENTS.ACCOUNT} element={<AccountPage />} />
        <Route path={SEGMENTS.TABLE} element={<TablePage />} />
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
