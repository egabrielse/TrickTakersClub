import { LoadingButton } from "@mui/lab";
import { Button, Link, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { VALIDATION_ERRORS } from "../../../constants/error";
import { AuthContext } from "../../../firebase/FirebaseAuthProvider";
import dialogActions from "../../../redux/features/dialog/actions";
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
  const { error, loading, login, clearError } = useContext(AuthContext);

  const onSuccess = () => {
    dispatch(dialogActions.closeDialog());
  };

  const onFailure = () => {
    // Do nothing
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      login(values.email, values.password, onSuccess, onFailure);
    },
  });

  const openRegisterDialog = () => {
    dispatch(dialogActions.closeDialog());
    dispatch(dialogActions.openDialog(DIALOG_TYPES.REGISTER));
  };

  const openResetPassDialog = () => {
    dispatch(dialogActions.closeDialog());
    dispatch(dialogActions.openDialog(DIALOG_TYPES.RESET_PASSWORD));
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
          <Link
            component="button"
            variant="body1"
            onClick={openResetPassDialog}
            style={{ paddingBottom: "1rem" }}
            underline="hover"
          >
            Forgot your password?
          </Link>
          <DialogErrorMessage error={error} clearError={clearError} />
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
