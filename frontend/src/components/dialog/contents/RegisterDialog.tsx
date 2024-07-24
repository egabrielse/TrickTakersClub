import LoopIcon from "@mui/icons-material/Loop";
import { LoadingButton } from "@mui/lab";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { VALIDATION_ERRORS } from "../../../constants/error";
import authActions from "../../../redux/features/auth/action";
import dialogActions from "../../../redux/features/dialog/actions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectAuthError, selectAuthLoading } from "../../../redux/selectors";
import { generateDisplayName } from "../../../utils/user";
import Logo from "../../common/AppLogo";
import CloseDialogButton from "../components/CloseDialogButton";
import DialogBody from "../components/DialogBody";
import DialogErrorMessage from "../components/DialogErrorMessage";
import DialogFooter from "../components/DialogFooter";
import DialogHeader from "../components/DialogHeader";

const validationSchema = yup.object({
  displayName: yup.string().required(VALIDATION_ERRORS.DISPLAY_NAME.REQUIRED),
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
  const error = useAppSelector(selectAuthError);
  const loading = useAppSelector(selectAuthLoading);
  const [displayNameOptions, setDisplayNameOptions] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      displayName: "",
      email: "",
      password: "",
      confirm: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { email, password, displayName } = values;
      dispatch(authActions.signUp({ email, password, displayName }))
        .unwrap()
        .then(() => {
          dispatch(dialogActions.closeDialog());
        });
    },
  });

  // Open login dialog
  const openLoginDialog = () => {
    dispatch(dialogActions.closeDialog());
    dispatch(dialogActions.openDialog(DIALOG_TYPES.LOGIN));
  };

  // Generate new display name options
  const cycleNameOptions = () => {
    const newOptions = [];
    for (let i = 0; i < 5; i++) {
      newOptions.push(generateDisplayName());
    }
    setDisplayNameOptions(newOptions);
  };

  // Handle cycling through display name options
  const handleCycleNameOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    cycleNameOptions();
  };

  const handleClearError = () => {
    dispatch(authActions.resetError());
  };

  // Generate initial display name options when form is first opened
  useEffect(() => {
    cycleNameOptions();
  }, []);

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
            id="display-name"
            name="display-name"
            label="Display Name"
            size="small"
            select
            disabled={loading}
            value={formik.values.displayName}
            onBlur={formik.handleBlur}
            error={
              formik.touched.displayName && Boolean(formik.errors.displayName)
            }
            helperText={
              formik.touched.displayName && formik.errors.displayName
                ? formik.errors.displayName
                : " "
            }
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                padding: "0 0.5rem",
              }}
            >
              <Button
                onClick={handleCycleNameOptions}
                startIcon={<LoopIcon />}
                variant="text"
                sx={{
                  textTransform: "none",
                  fontStyle: "italic",
                  fontSize: "0.75rem",
                }}
              >
                Cycle Names
              </Button>
            </Box>
            {formik.values.displayName &&
              !displayNameOptions.includes(formik.values.displayName) && (
                <MenuItem
                  selected
                  key={formik.values.displayName}
                  value={formik.values.displayName}
                >
                  {formik.values.displayName}
                </MenuItem>
              )}
            {displayNameOptions.map((name) => (
              <MenuItem
                key={name}
                value={name}
                selected={name === formik.values.displayName}
                onClick={() => formik.setFieldValue("displayName", name)}
              >
                {name}
              </MenuItem>
            ))}
          </TextField>
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
            Sign Up!
          </LoadingButton>
          <Button
            onClick={openLoginDialog}
            variant="outlined"
            disabled={loading}
          >
            Login
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
