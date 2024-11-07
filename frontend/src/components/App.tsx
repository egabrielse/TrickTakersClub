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
import PrivateRoutes from "./pages/PrivateRoutes";
import AccountPage from "./pages/account/AccountPage";
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
      <Route index element={<HomePage />} />
      <Route path={PATHS.HOME} element={<HomePage />} />
      <Route path={PATHS.RULES} element={<RulesPage />} />
      <Route element={<PrivateRoutes />}>
        <Route path={PATHS.ACCOUNT} element={<AccountPage />} />
        <Route path={PATHS.TABLE} element={<TablePage />} />
      </Route>
    </Route>,
  ),
);

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_HOST;

export default function App() {
  return (
    <Provider store={store}>
      <FirebaseAuthProvider>
        <RouterProvider router={router} />
      </FirebaseAuthProvider>
    </Provider>
  );
}
