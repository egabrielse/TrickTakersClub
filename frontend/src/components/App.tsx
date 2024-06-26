import { SEGMENTS } from '../constants/path';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import RootLayout from './layout/RootLayout';
import RootErrorBoundary from './error/RootErrorBoundary';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import AuthProvider from './providers/AuthProvider';
import AppPageLayout from './layout/AppPageLayout';
import HomePage from './home/HomePage';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RootLayout />
    ),
    errorElement: <RootErrorBoundary />,
    children: [
      {
        path: SEGMENTS.APP,
        element:  <AppPageLayout />,
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
            path: SEGMENTS.PROFILE,
            element: <div>Profile</div>,
          },
          {
            path: SEGMENTS.ABOUT,
            element: <div>About</div>
          },
        ],
      },
    ]
  },
]);

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  )
}
