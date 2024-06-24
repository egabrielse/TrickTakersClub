import { PATHS } from '../constants/path';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './home/HomePage';
import RootLayout from './router/RootLayout';
import RootErrorBoundary from './router/RootErrorBoundary';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import AuthProvider from './providers/AuthProvider';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: (
      <RootLayout />
    ),
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element:  <HomePage />,
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
