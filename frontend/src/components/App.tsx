import { PATHS } from '../constants/path';
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './Home/HomePage';
import LoginPage from './Login/LoginPage';
import RegisterPage from './Register/RegisterPage';
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
