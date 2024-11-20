import { Divider } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useContext } from "react";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { createTable } from "../../../api/table.api";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { VALIDATION_ERRORS } from "../../../constants/error";
import { PATHS } from "../../../constants/url";
import AppLogo from "../../common/AppLogo";
import AccountToolbar from "../../layout/AccountToolbar";
import { AuthContext } from "../../providers/AuthProvider";
import { DialogContext } from "../../providers/DialogProvider";
import "./HomePage.scss";

export default function HomePage() {
  const { openDialog } = useContext(DialogContext);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const navigateToTable = (tableId: string) => {
    navigate(PATHS.TABLE.replace(":tableId", tableId));
  };

  const handlePlay = () => {
    if (user === null) {
      openDialog({ type: DIALOG_TYPES.LOGIN });
    } else {
      createTable()
        .then((table) => navigateToTable(table.id))
        .catch((error) => {
          console.error(error);
          openDialog({
            type: DIALOG_TYPES.ERROR,
            props: {
              title: "Error Creating Table",
              message: "There was an error creating the table.",
            },
          });
        });
    }
  };

  return (
    <div className="HomePage">
      <AccountToolbar />
      <AppLogo size="xlarge" color="white" />
      <h1>TRICK TAKERS CLUB</h1>
      <button type="button" onClick={handlePlay}>
        Host Table
      </button>
      <Divider orientation="horizontal" color="white" />
      <Formik
        initialValues={{ tableId: "" }}
        onSubmit={(values) => navigateToTable(values.tableId)}
        validationSchema={yup.object({
          tableId: yup
            .string()
            .trim()
            .required(VALIDATION_ERRORS.TABLE_CODE.REQUIRED),
        })}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Field
                type="input"
                name="tableId"
                autoComplete="off"
                placeholder="Enter Table Code"
              />
              <ErrorMessage name="tableId" component="div" />
              <button
                type="submit"
                disabled={isSubmitting || !!(errors.tableId && touched.tableId)}
              >
                Join Table
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
