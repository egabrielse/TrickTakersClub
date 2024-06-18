import AppName from "../common/AppName";
import Logo from "../common/AppLogo";
import AuthPageLayout from './AuthPageLayout'
import RegisterForm from "./RegisterForm";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { PATHS } from "../../constants/path";

export default function RegisterPage() {
  return (
    <AuthPageLayout>
      <Logo size="xlarge" />
      <AppName size="xxlarge" />
      <RegisterForm />
      <br />
      <Link to={PATHS.LOGIN}>
        <Typography variant='body1' align='center'>
          Already have an account? Login!
        </Typography>
      </Link>
    </AuthPageLayout>
  )
}