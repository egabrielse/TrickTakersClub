import * as yup from "yup";
import Typography from "@mui/material/Typography";
import Logo from "../../common/AppLogo";
import { useAppDispatch } from "../../../redux/hooks";
import dialogSlice from "../../../redux/slices/dialog.slice";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { AuthErrorCodes, createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../../../firebase/auth";
import { useState } from "react";
import DialogHeader from "../components/DialogHeader";
import DialogBody from "../components/DialogBody";
import { LoadingButton } from "@mui/lab";
import CloseDialogButton from "../components/CloseDialogButton";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { ERROR_MESSAGES, VALIDATION_ERRORS } from "../../../constants/error";
import DialogErrorMessage from "../components/DialogErrorMessage";
import DialogFooter from "../components/DialogFooter";

const validationSchema = yup.object({
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

export default function RegisterDialog() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      displayName: "",
      email: "",
      password: "",
      confirm: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(() => {
          setLoading(false)
          dispatch(dialogSlice.actions.closeDialog())
          dispatch(dialogSlice.actions.openDialog(DIALOG_TYPES.INIT_ACCOUNT));
        })
        .catch((e) => {
          setLoading(false)
          if (e.code === AuthErrorCodes.EMAIL_EXISTS) {
            setError(ERROR_MESSAGES.ALREADY_EXISTS);
          } else {
            setError(ERROR_MESSAGES.DEFAULT);
          }
        })
    },
  });

  // Open login dialog
  const openLoginDialog = () => {
    dispatch(dialogSlice.actions.closeDialog());
    dispatch(dialogSlice.actions.openDialog(DIALOG_TYPES.LOGIN));
  };

  return (
    <>
      <CloseDialogButton />
      <DialogHeader>
        <Logo size="large" />
        <Typography variant="h5" align="center">
          Create a New Account
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
            Sign Up!
          </LoadingButton>
          <Button
            onClick={openLoginDialog}
            variant="outlined"
            disabled={loading}
          >
            Sign In
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
