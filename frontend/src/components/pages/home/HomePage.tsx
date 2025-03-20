import { Divider, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { createTable } from "../../../api/table.api";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { VALIDATION_ERRORS } from "../../../constants/error";
import { PATHS, SEGMENTS } from "../../../constants/url";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import dialogSlice from "../../../store/slices/dialog.slice";
import ActionButton from "../../common/ActionButton";
import AppLogo from "../../common/AppLogo";
import "./HomePage.scss";

const validationSchema = yup.object({
  tableId: yup
    .string()
    .trim()
    .matches(/^[a-z-]+$/, VALIDATION_ERRORS.TABLE_CODE.INVALID)
    .required(VALIDATION_ERRORS.TABLE_CODE.REQUIRED),
});

export default function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(authSlice.selectors.isAuthenticated);
  const [loading, setLoading] = useState(false);

  const navigateToTable = (tableId: string) => {
    navigate(PATHS.TABLE.replace(":tableId", tableId));
  };

  const formik = useFormik({
    initialValues: { tableId: "" },
    validationSchema: validationSchema,
    onSubmit: (values) => navigateToTable(values.tableId),
  });

  const handlePlay = () => {
    setLoading(true);
    if (!isAuthenticated) {
      dispatch(
        dialogSlice.actions.openDialog({
          type: DIALOG_TYPES.LOGIN,
          closeable: true,
        }),
      );
      setLoading(false);
    } else {
      createTable()
        .then((table) => navigateToTable(table.id))
        .catch((error) => {
          console.error(error);
          dispatch(
            dialogSlice.actions.openDialog({
              type: DIALOG_TYPES.ERROR,
              props: {
                title: "Error Creating Table",
                message: "There was an error creating the table.",
              },
            }),
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Paper className="HomePage">
      <AppLogo size="xxlarge" color="white" />
      <Typography variant="h2" color="white">
        Trick Takers Club
      </Typography>
      <ActionButton
        label="Host Table"
        onClick={handlePlay}
        disabled={loading}
      />
      <Divider orientation="horizontal" color="white" />
      <form
        onSubmit={formik.handleSubmit}
        style={{ width: "100%", display: "flex", flexDirection: "column" }}
      >
        <TextField
          id="tableId"
          name="tableId"
          label="Invite Code"
          size="medium"
          value={formik.values.tableId}
          onChange={formik.handleChange}
          error={formik.touched.tableId && Boolean(formik.errors.tableId)}
          helperText={formik.touched.tableId && formik.errors.tableId}
          onPaste={(e) => {
            if (e.clipboardData) {
              const text = e.clipboardData.getData("text");
              const prefix = location.origin + "/" + SEGMENTS.TABLE + "/";
              if (text.startsWith(prefix)) {
                e.preventDefault();
                formik.setFieldValue(
                  "tableId",
                  text.substring(text.lastIndexOf("/") + 1),
                );
              }
            }
          }}
        />
        <ActionButton
          color="secondary"
          label="Join Table"
          disabled={loading}
          type="submit"
        />
      </form>
    </Paper>
  );
}
