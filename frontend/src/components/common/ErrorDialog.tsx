import { Box, Paper, Typography } from "@mui/material";
import { ReactNode } from "react";
import "./ErrorDialog.scss";
import ReturnHomeButton from "./ReturnHomeButton";

type ErrorDialogProps = {
  title: string;
  details: ReactNode;
  srcImage: string;
};

export default function ErrorDialog({
  title,
  details,
  srcImage,
}: ErrorDialogProps): ReactNode {
  return (
    <Paper className="ErrorDialog card" elevation={5}>
      <Box className="ErrorDialog-Image" component="img" src={srcImage} />
      <Typography variant="h4">{title}</Typography>
      <Typography className="ErrorDialog-Details" variant="subtitle1">
        {details}
      </Typography>
      <ReturnHomeButton />
    </Paper>
  );
}
