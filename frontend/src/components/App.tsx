import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { SEGMENTS } from "../constants/path";
import { store } from "../redux/store";
import RootErrorBoundary from "./error/RootErrorBoundary";
import RootLayout from "./layout/RootLayout";
import AuthProvider from "./providers/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        path: SEGMENTS.RULES,
        element: <div>Rules</div>,
      },
      {
        path: SEGMENTS.ACCOUNT,
        element: <div>Account</div>,
      },
      {
        path: SEGMENTS.TABLE,
        element: <div>Table</div>,
      },
    ],
  },
]);

const theme = createTheme({
  palette: {
    primary: {
      main: "#795C32",
      light: "#A68C6B",
    },
    secondary: {
      main: "#0C4767",
      light: "#2187AD",
    },
    background: {
      default: "#006400",
    },
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
