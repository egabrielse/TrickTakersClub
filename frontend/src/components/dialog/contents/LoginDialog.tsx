import { Button, Link, TextField } from "@mui/material";
import { FirebaseError } from "firebase/app";
import { AuthErrorCodes, signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { ERROR_MESSAGES, VALIDATION_ERRORS } from "../../../constants/error";
import auth from "../../../firebase/auth";
import { useAppDispatch } from "../../../store/hooks";
import dialogSlice from "../../../store/slices/dialog.slice";
import { LoginDialogParams } from "../../../types/dialog";
import AppLogo from "../../common/AppLogo";
import CloseDialogButton from "../components/CloseDialogButton";
import DialogBody from "../components/DialogBody";
import DialogErrorMessage from "../components/DialogErrorMessage";
import DialogFooter from "../components/DialogFooter";
import DialogHeader from "../components/DialogHeader";

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

export default function LoginDialog({ closeable }: LoginDialogParams) {
  const dispatch = useAppDispatch();
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      const { email, password } = values;
      signInWithEmailAndPassword(auth, email, password)
        .then(() => dispatch(dialogSlice.actions.closeDialog()))
        .catch((error) => {
          if (error instanceof FirebaseError) {
            switch (error.code) {
              case AuthErrorCodes.INVALID_EMAIL:
                setErrMsg(ERROR_MESSAGES.INVALID_EMAIL);
                break;
              case AuthErrorCodes.USER_DELETED: // ? why is this user-not-found ?
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
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const openRegisterDialog = () => {
    dispatch(dialogSlice.actions.closeDialog());
    dispatch(
      dialogSlice.actions.openDialog({
        type: DIALOG_TYPES.REGISTER,
        closeable,
      }),
    );
  };

  const openResetPassDialog = () => {
    dispatch(dialogSlice.actions.closeDialog());
    dispatch(
      dialogSlice.actions.openDialog({
        type: DIALOG_TYPES.RESET,
        closeable,
      }),
    );
  };

  const handleClearError = () => {
    setErrMsg(null);
  };

  return (
    <>
      {closeable && <CloseDialogButton />}
      <DialogHeader>
        <AppLogo size="large" />
        <h2>LOGIN TO ACCOUNT</h2>
      </DialogHeader>
      <form onSubmit={formik.handleSubmit}>
        <DialogBody>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            autoComplete="off"
            size="small"
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
            onClick={openResetPassDialog}
            style={{ paddingBottom: "1rem" }}
            underline="hover"
            type="button"
          >
            Forgot your password?
          </Link>
          <DialogErrorMessage error={errMsg} clearError={handleClearError} />
        </DialogBody>
        <DialogFooter>
          <Button
            color="primary"
            loading={loading}
            type="submit"
            variant="contained"
            disabled={!formik.isValid}
          >
            Sign In!
          </Button>
          <Button
            onClick={openRegisterDialog}
            variant="outlined"
            style={{ alignSelf: "start" }}
          >
            Sign Up
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
