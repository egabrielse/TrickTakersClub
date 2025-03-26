import { Button, Link, Paper, TextField } from "@mui/material";
import { FirebaseError } from "firebase/app";
import { AuthErrorCodes, signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import { ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import * as yup from "yup";
import { ERROR_MESSAGES, VALIDATION_ERRORS } from "../../../constants/error";
import { PATHS } from "../../../constants/url";
import auth from "../../../firebase/auth";
import AppLogo from "../../common/AppLogo";
import DialogErrorMessage from "../../dialog/components/DialogErrorMessage";
import "./AuthPage.scss";

const validationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email(VALIDATION_ERRORS.EMAIL.INVALID)
    .required(VALIDATION_ERRORS.EMAIL.REQUIRED),
  password: yup
    .string()
    .trim()
    .min(8, VALIDATION_ERRORS.PASSWORD.MIN)
    .max(32, VALIDATION_ERRORS.PASSWORD.MAX)
    .required(VALIDATION_ERRORS.PASSWORD.REQUIRED),
});

const initialValues = {
  email: "",
  password: "",
};

export default function LoginPage(): ReactNode {
  const location = useLocation();
  const redirectPath: string = location?.state?.redirectPath || PATHS.HOME;
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      const { email, password } = values;
      signInWithEmailAndPassword(auth, email, password)
        .then(() => navigate(redirectPath))
        .catch((error) => {
          if (error instanceof FirebaseError) {
            switch (error.code) {
              case AuthErrorCodes.INVALID_EMAIL:
                setErrMsg(ERROR_MESSAGES.INVALID_EMAIL);
                break;
              case AuthErrorCodes.USER_DELETED: // ? why is the value "user-not-found" ?
              case AuthErrorCodes.INVALID_PASSWORD:
                setErrMsg(ERROR_MESSAGES.INVALID_CREDENTIALS);
                break;
              default:
                setErrMsg(ERROR_MESSAGES.DEFAULT);
            }
          } else {
            setErrMsg(ERROR_MESSAGES.DEFAULT);
          }
        })
        .finally(() => setLoading(false));
    },
  });

  const navigateToRegisterPage = () => {
    navigate(PATHS.REGISTER);
  };

  const navigateToResetPassword = () => {
    navigate(PATHS.RESET_PASSWORD);
  };

  const handleClearError = () => {
    setErrMsg(null);
  };

  return (
    <div className="AuthPage">
      <Paper className="Form">
        <div className="Form-Header">
          <AppLogo size="xlarge" />
          <h2>ACCOUNT LOGIN</h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="Form-Body">
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              size="small"
              autoComplete="off"
              disabled={loading}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : " "
              }
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              size="small"
              autoComplete="off"
              disabled={loading}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : " "
              }
            />
            <Link
              component="button"
              variant="body1"
              disabled={loading}
              onClick={navigateToResetPassword}
              style={{ paddingBottom: "1rem" }}
              underline="hover"
              type="button"
            >
              Forgot your password?
            </Link>
            <DialogErrorMessage error={errMsg} clearError={handleClearError} />
          </div>
          <div className="Form-Footer">
            <Button
              onClick={navigateToRegisterPage}
              variant="outlined"
              disabled={loading}
            >
              Sign Up
            </Button>
            <Button
              color="primary"
              loading={loading}
              type="submit"
              variant="contained"
              disabled={!formik.isValid}
            >
              Sign In!
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
