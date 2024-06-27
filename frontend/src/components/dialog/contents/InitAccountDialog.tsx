import LoopIcon from "@mui/icons-material/Loop";
import { LoadingButton } from "@mui/lab";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { reload, updateProfile } from "firebase/auth";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { VALIDATION_ERRORS } from "../../../constants/error";
import auth from "../../../firebase/auth";
import { useAppDispatch } from "../../../redux/hooks";
import dialogSlice from "../../../redux/slices/dialog.slice";
import { generateDisplayName } from "../../../utils/user";
import Logo from "../../common/AppLogo";
import DialogBody from "../components/DialogBody";
import DialogFooter from "../components/DialogFooter";
import DialogHeader from "../components/DialogHeader";

const validationSchema = yup.object({
  displayName: yup.string().required(VALIDATION_ERRORS.DISPLAY_NAME.REQUIRED),
});

export default function InitAccountDialog() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [displayNameOptions, setDisplayNameOptions] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      displayName: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      updateProfile(auth.currentUser!, {
        displayName: values.displayName,
      }).then(() => {
        setLoading(false);
        // reload the user to get the updated display name
        reload(auth.currentUser!);
        dispatch(dialogSlice.actions.closeDialog());
      });
    },
  });

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

  // Generate initial display name options when form is first opened
  useEffect(() => {
    cycleNameOptions();
  }, []);

  return (
    <>
      <DialogHeader>
        <Logo size="large" />
        <Typography variant="h5" align="center">
          Account Created!
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
        </DialogBody>

        <DialogFooter>
          <LoadingButton
            color="primary"
            loading={loading}
            type="submit"
            variant="contained"
            disabled={!formik.isValid}
          >
            Done
          </LoadingButton>
        </DialogFooter>
      </form>
    </>
  );
}
