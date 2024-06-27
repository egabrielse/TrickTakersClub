import { LoadingButton } from "@mui/lab";
import { Button, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { AuthErrorCodes, signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { ERROR_MESSAGES, VALIDATION_ERRORS } from "../../../constants/error";
import auth from "../../../firebase/auth";
import dialogSlice from "../../../redux/slices/dialog.slice";
import Logo from "../../common/AppLogo";
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

export default function LoginDialog() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(() => {
          setLoading(false);
          dispatch(dialogSlice.actions.closeDialog());
        })
        .catch((error) => {
          if (error.code === AuthErrorCodes.USER_DELETED) {
            setError(ERROR_MESSAGES.INVALID_CREDENTIALS);
          } else if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
            setError(ERROR_MESSAGES.INVALID_CREDENTIALS);
          } else {
            setError(ERROR_MESSAGES.DEFAULT);
          }
        });
    },
  });

  const openRegisterDialog = () => {
    dispatch(dialogSlice.actions.closeDialog());
    dispatch(dialogSlice.actions.openDialog(DIALOG_TYPES.REGISTER));
  };

  return (
    <>
      <CloseDialogButton />
      <DialogHeader>
        <Logo size="large" />
        <Typography variant="h5" align="center">
          Login to Trick Takers Club
        </Typography>
      </DialogHeader>
      <form onSubmit={formik.handleSubmit}>
        <DialogBody>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
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
          <DialogErrorMessage error={error} clearError={() => setError(null)} />
        </DialogBody>
        <DialogFooter>
          <LoadingButton
            color="primary"
            loading={loading}
            type="submit"
            variant="contained"
            disabled={!formik.isValid}
          >
            Sign In!
          </LoadingButton>
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
