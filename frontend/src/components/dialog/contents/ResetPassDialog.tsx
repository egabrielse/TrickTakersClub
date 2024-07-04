import { LoadingButton } from "@mui/lab";
import { Button, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { DISPLAY_MESSAGES } from "../../../constants/display";
import { VALIDATION_ERRORS } from "../../../constants/error";
import dialogActions from "../../../redux/features/dialog/actions";
import Logo from "../../common/AppLogo";
import { AuthContext } from "../../providers/AuthProvider";
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
  const dispatch = useDispatch();
  const [sent, setSent] = useState(false);
  const { error, loading, resetPassword, clearError } = useContext(AuthContext);

  const onSuccess = () => {
    setSent(true);
  };

  const onFailure = () => {
    // Do nothing
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      resetPassword(values.email, onSuccess, onFailure);
    },
  });

  const openRegisterDialog = () => {
    dispatch(dialogActions.closeDialog());
    dispatch(dialogActions.openDialog(DIALOG_TYPES.LOGIN));
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
          <DialogErrorMessage error={error} clearError={clearError} />
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
