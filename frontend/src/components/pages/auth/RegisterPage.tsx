import LoopIcon from "@mui/icons-material/Loop";
import { Box, Button, MenuItem, Paper, TextField } from "@mui/material";
import { FirebaseError } from "firebase/app";
import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useFormik } from "formik";
import { generateSlug } from "random-word-slugs";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import * as yup from "yup";
import { ERROR_MESSAGES, VALIDATION_ERRORS } from "../../../constants/error";
import { PATHS } from "../../../constants/url";
import auth from "../../../firebase/auth";
import AppLogo from "../../common/AppLogo";
import DialogErrorMessage from "../../dialog/components/DialogErrorMessage";
import "./AuthPage.scss";

const validationSchema = yup.object({
  displayName: yup.string().required(VALIDATION_ERRORS.DISPLAY_NAME.REQUIRED),
  email: yup
    .string()
    .email(VALIDATION_ERRORS.EMAIL.INVALID)
    .required(VALIDATION_ERRORS.EMAIL.REQUIRED),
  password: yup
    .string()
    .trim()
    .min(8, VALIDATION_ERRORS.PASSWORD.MIN)
    .max(32, VALIDATION_ERRORS.PASSWORD.MAX)
    .required(VALIDATION_ERRORS.PASSWORD.REQUIRED),
  confirm: yup
    .string()
    .trim()
    .oneOf([yup.ref("password"), ""], VALIDATION_ERRORS.CONFIRM_PASSWORD.MATCH)
    .required(VALIDATION_ERRORS.CONFIRM_PASSWORD.REQUIRED),
});

const initialValues = {
  displayName: "",
  email: "",
  password: "",
  confirm: "",
};

export default function RegisterPage(): ReactNode {
  const location = useLocation();
  const redirectPath: string = location?.state?.redirectPath || PATHS.HOME;
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [displayNameOptions, setDisplayNameOptions] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      const { email, password, displayName } = values;
      createUserWithEmailAndPassword(auth, email, password)
        .then((response) => {
          updateProfile(response.user, { displayName })
            .then(() => {
              response.user.reload();
              navigate(redirectPath);
            })
            .catch(() => setErrMsg(ERROR_MESSAGES.INVALID_DISPLAY_NAME));
        })
        .catch((error) => {
          if (error instanceof FirebaseError) {
            switch (error.code) {
              case AuthErrorCodes.INVALID_EMAIL:
                setErrMsg(ERROR_MESSAGES.INVALID_EMAIL);
                break;
              case AuthErrorCodes.EMAIL_EXISTS:
                setErrMsg(ERROR_MESSAGES.ALREADY_EXISTS);
                break;
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

  // Generate new display name options
  const cycleNameOptions = () => {
    const newOptions = [];
    for (let i = 0; i < 5; i++) {
      newOptions.push(generateSlug(2, { format: "title" }));
    }
    setDisplayNameOptions(newOptions);
  };

  // Handle cycling through display name options
  const handleCycleNameOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    cycleNameOptions();
  };

  // Generate initial display name options when form is first opened
  useEffect(() => {
    cycleNameOptions();
  }, []);

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
          <h2>CREATE ACCOUNT</h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="Form-Body">
            <TextField
              fullWidth
              id="display-name"
              name="display-name"
              label="Display Name"
              size="small"
              select
              autoComplete="off"
              disabled={loading}
              value={formik.values.displayName}
              onBlur={formik.handleBlur}
              error={
                formik.touched.displayName && Boolean(formik.errors.displayName)
              }
              helperText={
                formik.touched.displayName && formik.errors.displayName
                  ? formik.errors.displayName
                  : " "
              }
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  padding: "0 0.5rem",
                }}
              >
                <Button
                  onClick={handleCycleNameOptions}
                  startIcon={<LoopIcon />}
                  variant="text"
                  sx={{
                    textTransform: "none",
                    fontStyle: "italic",
                    fontSize: "0.75rem",
                  }}
                >
                  Cycle Names
                </Button>
              </Box>
              {formik.values.displayName &&
                !displayNameOptions.includes(formik.values.displayName) && (
                  <MenuItem
                    selected
                    key={formik.values.displayName}
                    value={formik.values.displayName}
                  >
                    {formik.values.displayName}
                  </MenuItem>
                )}
              {displayNameOptions.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  selected={name === formik.values.displayName}
                  onClick={() => formik.setFieldValue("displayName", name)}
                >
                  {name}
                </MenuItem>
              ))}
            </TextField>
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
            <TextField
              fullWidth
              id="confirm"
              name="confirm"
              label="Confirm Password"
              autoComplete="off"
              type="password"
              size="small"
              disabled={loading}
              value={formik.values.confirm}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirm && Boolean(formik.errors.confirm)}
              helperText={
                formik.touched.confirm && formik.errors.confirm
                  ? formik.errors.confirm
                  : " "
              }
            />
            <DialogErrorMessage error={errMsg} clearError={handleClearError} />
          </div>
          <div className="Form-Footer">
            <Button
              onClick={navigateToLoginPage}
              variant="outlined"
              disabled={loading}
            >
              Login
            </Button>
            <Button
              color="primary"
              loading={loading}
              type="submit"
              variant="contained"
              disabled={!formik.isValid}
            >
              Sign Up!
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
