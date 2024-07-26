import { useEffect } from "react";
import { useParams } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import dialogActions from "../../../redux/features/dialog/actions";
import tableActions from "../../../redux/features/table/actions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  selectTableError,
  selectTableId,
  selectTableLoading,
} from "../../../redux/selectors";
import LoadingPage from "../loading/LoadingPage";
import "./TablePage.scss";

export default function TablePage() {
  const params = useParams();
  const paramTableId = String(params.tableId);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectTableLoading);
  const error = useAppSelector(selectTableError);
  const tableId = useAppSelector(selectTableId);

  useEffect(() => {
    if (error) {
      dispatch(
        dialogActions.openDialog({
          type: DIALOG_TYPES.ERROR,
          props: {
            title: "404 Table Not Found",
            message: "There was an error finding this table.",
          },
        }),
      );
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(tableActions.fetchTable(paramTableId));
  }, [dispatch, paramTableId]);
  return loading ? <LoadingPage /> : <div className="TablePage">{tableId}</div>;
}
