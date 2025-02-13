import { Button, TextField } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { DISPLAY_MESSAGES } from "../../../constants/display";
import { VALIDATION_ERRORS } from "../../../constants/error";
import auth from "../../../firebase/auth";
import { useAppDispatch } from "../../../store/hooks";
import dialogSlice from "../../../store/slices/dialog.slice";
import { ResetPasswordDialogParams } from "../../../types/dialog";
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

const initialValues = {
  email: "",
};

export default function ResetPassDialog({
  closeable,
}: ResetPasswordDialogParams) {
  const dispatch = useAppDispatch();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      sendPasswordResetEmail(auth, values.email)
        .then(() => setSent(true))
        .catch((error) => {
          console.error(error);
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const openLoginDialog = () => {
    dispatch(
      dialogSlice.actions.openDialog({ type: DIALOG_TYPES.LOGIN, closeable }),
    );
  };

  const handleClearError = () => {
    setError(null);
  };

  return (
    <>
      {closeable && <CloseDialogButton />}
      <DialogHeader>
        <Logo size="large" />
        <h2>RESET PASSWORD</h2>
      </DialogHeader>
      <form onSubmit={formik.handleSubmit}>
        <DialogBody>
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
          <DialogErrorMessage error={error} clearError={handleClearError} />
        </DialogBody>
        <DialogFooter>
          <Button
            color="primary"
            loading={loading}
            type="submit"
            variant="contained"
            disabled={!formik.isValid || sent}
          >
            Reset
          </Button>
          <Button
            onClick={openLoginDialog}
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
