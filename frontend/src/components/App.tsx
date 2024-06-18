import './App.scss'
import { PATHS } from '../constants/path';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './Home/HomePage';
import LoginPage from './Authentication/LoginPage';
import RegisterPage from './Authentication/RegisterPage';
import TablePage from './Table/TablePage';
import LeaderboardPage from './Leaderboard/LeaderboardPage';
import RulesPage from './Rules/RulesPage';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <HomePage />,
  },
  {
    path: PATHS.LEADERBOARD,
    element: <LeaderboardPage />,
  },
  {
    path: PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: PATHS.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: PATHS.RULES,
    element: <RulesPage />,
  },
  {
    path: PATHS.TABLE,
    element: <TablePage />,
  },
]);


export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
