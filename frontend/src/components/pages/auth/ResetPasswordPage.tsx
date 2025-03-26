import { Button, Paper, TextField } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { useFormik } from "formik";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { DISPLAY_MESSAGES } from "../../../constants/display";
import { ERROR_MESSAGES, VALIDATION_ERRORS } from "../../../constants/error";
import { PATHS } from "../../../constants/url";
import auth from "../../../firebase/auth";
import AppLogo from "../../common/AppLogo";
import DialogErrorMessage from "../../dialog/components/DialogErrorMessage";
import DialogMessage from "../../dialog/components/DialogMessage";
import "./AuthPage.scss";

const validationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email(VALIDATION_ERRORS.EMAIL.INVALID)
    .required(VALIDATION_ERRORS.EMAIL.REQUIRED),
});

const initialValues = {
  email: "",
};

export default function ResetPasswordPage(): ReactNode {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      sendPasswordResetEmail(auth, values.email)
        .then(() => setSent(true))
        .catch((error) => {
          console.error(error);
          setErrMsg(ERROR_MESSAGES.DEFAULT);
        })
        .finally(() => setLoading(false));
    },
  });

  const navigateToLoginPage = () => {
    navigate(PATHS.LOGIN);
  };

  const handleClearError = () => {
    setErrMsg(null);
  };

  return (
    <div className="AuthPage">
      <Paper className="Form">
        <div className="Form-Header">
          <AppLogo size="xlarge" />
          <h2>RESET PASSWORD</h2>
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
              disabled={sent}
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
            <DialogMessage
              message={sent ? DISPLAY_MESSAGES.RESET_PASSWORD : null}
              type="success"
            />
            <DialogErrorMessage error={errMsg} clearError={handleClearError} />
          </div>
          <div className="Form-Footer">
            <Button onClick={navigateToLoginPage} variant="outlined">
              Login
            </Button>
            <Button
              color="primary"
              loading={loading}
              type="submit"
              variant="contained"
              disabled={!formik.isValid || sent}
            >
              Reset
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
