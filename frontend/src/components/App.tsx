import { PATHS } from '../constants/path';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './Home/HomePage';
import LoginPage from './Authentication/LoginPage';
import RegisterPage from './Authentication/RegisterPage';
import RootLayout from './Router/RootLayout';
import RootErrorBoundary from './Router/RootErrorBoundary';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <RootLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element:  <HomePage />,
      },
      {
        path: PATHS.LOGIN,
        element: <LoginPage />,
      },
      {
        path: PATHS.REGISTER,
        element: <RegisterPage />,
      },
    ]
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
