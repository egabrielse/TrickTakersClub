import { LoadingButton } from "@mui/lab";
import { Button, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { DISPLAY_MESSAGES } from "../../../constants/display";
import { VALIDATION_ERRORS } from "../../../constants/error";
import authActions from "../../../redux/features/auth/action";
import dialogActions from "../../../redux/features/dialog/actions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectAuthError, selectAuthLoading } from "../../../redux/selectors";
import Logo from "../../common/AppLogo";
import CloseDialogButton from "../components/CloseDialogButton";
import DialogBody from "../components/DialogBody";
import DialogErrorMessage from "../components/DialogErrorMessage";
import DialogFooter from "../components/DialogFooter";
import DialogHeader from "../components/DialogHeader";
import DialogMessage from "../components/DialogMessage";

const validationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email(VALIDATION_ERRORS.EMAIL.INVALID)
    .required(VALIDATION_ERRORS.EMAIL.REQUIRED),
});

export default function ResetPassDialog() {
  const dispatch = useAppDispatch();
  const [sent, setSent] = useState(false);
  const error = useAppSelector(selectAuthError);
  const loading = useAppSelector(selectAuthLoading);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(authActions.sendPasswordResetEmail(values.email))
        .unwrap()
        .then(() => setSent(true));
    },
  });

  const openRegisterDialog = () => {
    dispatch(dialogActions.closeDialog());
    dispatch(dialogActions.openDialog({ type: DIALOG_TYPES.LOGIN }));
  };

  const handleClearError = () => {
    dispatch(authActions.resetError());
  };

  return (
    <>
      <CloseDialogButton />
      <DialogHeader>
        <Logo size="large" />
        <Typography variant="h5" align="center">
          Reset Password
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
          <DialogErrorMessage error={error} clearError={handleClearError} />
        </DialogBody>
        <DialogFooter>
          <LoadingButton
            color="primary"
            loading={loading}
            type="submit"
            variant="contained"
            disabled={!formik.isValid || sent}
          >
            Reset
          </LoadingButton>
          <Button
            onClick={openRegisterDialog}
            variant="outlined"
            style={{ alignSelf: "start" }}
          >
            Login
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
