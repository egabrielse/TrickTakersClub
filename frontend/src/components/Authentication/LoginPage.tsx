import Logo from "../common/AppLogo"
import LoginForm from "./LoginForm"
import AuthPageLayout from './AuthPageLayout'
import AppName from "../common/AppName"
import { Link } from "react-router-dom"
import { PATHS } from "../../constants/path"
import { Typography } from "@mui/material"

export default function LoginPage() {
  return (
    <AuthPageLayout>
      <Logo size="xlarge" />
      <AppName size="xxlarge" />
      <LoginForm />
      <br />
      <Link to={PATHS.REGISTER}>
        <Typography variant="body1" align="center">
          New? Create an account!
        </Typography>
      </Link>
    </AuthPageLayout>
  )
}