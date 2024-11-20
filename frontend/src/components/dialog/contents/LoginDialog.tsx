import { LoadingButton } from "@mui/lab";
import { Button, Link, TextField } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import * as yup from "yup";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { VALIDATION_ERRORS } from "../../../constants/error";
import auth from "../../../firebase/auth";
import Logo from "../../common/AppLogo";
import { DialogContext } from "../../pages/providers/DialogProvider";
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

export default function LoginDialog() {
  const { closeDialog, openDialog, params } = useContext(DialogContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      const { email, password } = values;
      signInWithEmailAndPassword(auth, email, password)
        .then((response) => {
          console.log(response);
          closeDialog();
        })
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
    openDialog({
      type: DIALOG_TYPES.REGISTER,
      closeable: params?.closeable,
    });
  };

  const openResetPassDialog = () => {
    openDialog({
      type: DIALOG_TYPES.RESET,
      closeable: params?.closeable,
    });
  };

  const handleClearError = () => {
    setError(null);
  };

  return (
    <>
      {params?.closeable && <CloseDialogButton />}
      <DialogHeader>
        <Logo size="large" />
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
          >
            Forgot your password?
          </Link>
          <DialogErrorMessage error={error} clearError={handleClearError} />
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
