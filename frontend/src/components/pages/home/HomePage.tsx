import { Divider, Typography } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { VALIDATION_ERRORS } from "../../../constants/error";
import { PATHS } from "../../../constants/url";
import AppLogo from "../../common/AppLogo";
import AccountToolbar from "../../layout/AccountToolbar";
import "./HomePage.scss";
import PlayButton from "./PlayButton";

export default function HomePage() {
  const navigate = useNavigate();

  const navigateToTable = (tableId: string) => {
    navigate(PATHS.TABLE.replace(":tableId", tableId));
  };

  return (
    <div className="HomePage">
      <AccountToolbar />
      <AppLogo size="xlarge" color="white" />
      <Typography variant="h2" color="white">
        Trick Takers Club
      </Typography>
      <PlayButton />
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
