import * as yup from "yup";
import Typography from "@mui/material/Typography";
import Logo from "../../common/AppLogo";
import { useAppDispatch } from "../../../redux/hooks";
import dialogSlice from "../../../redux/slices/dialog.slice";
import { Button, DialogActions, TextField } from "@mui/material";
import { useFormik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../../../firebase/auth";
import { useState } from "react";
import DialogHeader from "../components/DialogHeader";
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
  confirm: yup
    .string()
    .oneOf([yup.ref("password"), ""], VALIDATION_ERRORS.CONFIRM_PASSWORD.MATCH)
    .required(VALIDATION_ERRORS.CONFIRM_PASSWORD.REQUIRED),
});

export default function RegisterDialog() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirm: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(() => {
          setLoading(true);
          dispatch(dialogSlice.actions.closeDialog());
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });

  const openLoginDialog = () => {
    dispatch(dialogSlice.actions.closeDialog());
    dispatch(dialogSlice.actions.openDialog("login"));
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
        </DialogBody>
        <DialogActions style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "1rem"}}>
          <Button
            onClick={openLoginDialog}
            variant="outlined"
            style={{ alignSelf: "start" }}
            disabled={loading}
          >
            Sign In
          </Button>
          <LoadingButton
            color="primary"
            loading={loading}
            type="submit"
            variant="contained"
            disabled={!formik.isValid}
          >
            Sign Up!
          </LoadingButton>
        </DialogActions>
      </form>
    </>
  );
}
