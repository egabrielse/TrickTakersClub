import { LoadingButton } from "@mui/lab";
import { Button, TextField } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import * as yup from "yup";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { DISPLAY_MESSAGES } from "../../../constants/display";
import { VALIDATION_ERRORS } from "../../../constants/error";
import auth from "../../../firebase/auth";
import Logo from "../../common/AppLogo";
import { DialogContext } from "../../pages/providers/DialogProvider";
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

export default function ResetPassDialog() {
  const { openDialog, params } = useContext(DialogContext);
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

  const openRegisterDialog = () => {
    openDialog({ type: DIALOG_TYPES.REGISTER, closeable: params?.closeable });
  };

  const handleClearError = () => {
    setError(null);
  };

  return (
    <>
      <CloseDialogButton />
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
