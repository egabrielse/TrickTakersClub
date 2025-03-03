import { Paper, Typography } from "@mui/material";
import { useAppSelector } from "../../../../store/hooks";
import tableSlice from "../../../../store/slices/table.slice";
import AppLogo from "../../../common/AppLogo";
import "./TableHeader.scss";

export default function TableHeader() {
  const tableId = useAppSelector(tableSlice.selectors.tableId);
  const styledTableId = tableId.toUpperCase().split("-");

  return (
    <Paper className="TableHeader">
      <AppLogo size="large" />
      <Typography variant="h6" sx={{ lineHeight: 0.75 }}>
        {styledTableId.map((line, index) => {
          const lastWord = index === styledTableId.length - 1;
          return (
            <span key={index}>
              {line}
              {!lastWord && <br />}
            </span>
          );
        })}
      </Typography>
    </Paper>
  );
}
