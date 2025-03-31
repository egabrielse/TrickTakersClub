import { Divider, Paper, TextField } from "@mui/material";
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
import PageTopper from "../../common/PageTopper";
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
      navigate(PATHS.LOGIN);
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
    <div className="HomePage">
      <PageTopper
        pre="Welcome to"
        title="Trick Takers Club"
        post={import.meta.env.VITE_REF_NAME}
      />
      <div className="HomePage-Tiles">
        <Paper className="HomePage-Tiles-Tile">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "center",
              gap: "1rem",
              flex: 1,
            }}
          >
            <div className="HomePage-Tiles-Tile-Header">
              <h1>PLAY SHEEPSHEAD!</h1>
            </div>
            <ActionButton
              label="Host Table"
              onClick={handlePlay}
              disabled={loading}
            />
            <Divider orientation="horizontal" color="white" />
            <form
              onSubmit={formik.handleSubmit}
              style={{ display: "flex", flexDirection: "column" }}
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
          </div>
        </Paper>
        <Paper className="HomePage-Tiles-Tile">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              flex: 1,
            }}
          >
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/pIbIIEHAM68?si=6V0VaRaWOGZhUVIA"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </Paper>
        <Paper className="HomePage-Tiles-Tile">
          Trick Takers Club is a place to play Sheepshead online with friends.
          This site is a work in progress and is being developed by a single
          person in their free time. I'm excited to continue adding new features
          and improving the site.
        </Paper>
      </div>
    </div>
  );
}
