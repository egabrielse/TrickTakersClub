import * as yup from "yup";
import Typography from "@mui/material/Typography";
import Logo from "../../common/AppLogo";
import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../../../firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import dialogSlice from "../../../redux/slices/dialog.slice";
import DialogHeader from "../components/DialogHeader";
import DialogFooter from "../components/DialogFooter";
import DialogBody from "../components/DialogBody";
import { VALIDATION_ERRORS } from "../../../constants/auth";
import { LoadingButton } from "@mui/lab";
import CloseDialogButton from "../components/CloseDialogButton";

const validationSchema = yup.object({
  email: yup
    .string()
    .email(VALIDATION_ERRORS.EMAIL.INVALID)
    .required(VALIDATION_ERRORS.EMAIL.REQUIRED),
  password: yup
    .string()
    .min(8, VALIDATION_ERRORS.PASSWORD.MIN)
    .max(32, VALIDATION_ERRORS.PASSWORD.MAX)
    .required(VALIDATION_ERRORS.PASSWORD.REQUIRED),
});

export default function LoginDialog() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(() => {
          setLoading(true);
          dispatch(dialogSlice.actions.closeDialog());
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });

  const openRegisterDialog = () => {
    dispatch(dialogSlice.actions.closeDialog());
    dispatch(dialogSlice.actions.openDialog("register"));
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
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={openRegisterDialog}
            variant="outlined"
            style={{ alignSelf: "start" }}
          >
            Sign Up
          </Button>
          <LoadingButton
            color="primary"
            loading={loading}
            type="submit"
            variant="contained"
            disabled={!formik.isValid}
          >
            Sign In!
          </LoadingButton>
        </DialogFooter>
      </form>
    </>
  );
}
