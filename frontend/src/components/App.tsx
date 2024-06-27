import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { SEGMENTS } from "../constants/path";
import { store } from "../redux/store";
import RootErrorBoundary from "./error/RootErrorBoundary";
import HomePage from "./home/HomePage";
import AppPageLayout from "./layout/AppPageLayout";
import RootLayout from "./layout/RootLayout";
import AuthProvider from "./providers/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        path: SEGMENTS.APP,
        element: <AppPageLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: SEGMENTS.LEADERBOARD,
            element: <div>Leaderboard</div>,
          },
          {
            path: SEGMENTS.RULES,
            element: <div>Rules</div>,
          },
          {
            path: SEGMENTS.ACCOUNT,
            element: <div>Account</div>,
          },
          {
            path: SEGMENTS.ABOUT,
            element: <div>About</div>,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  );
}
