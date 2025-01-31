import { Button, Typography } from "@mui/material";
import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../../constants/message";
import CardList from "../../../../common/CardList";
import { AuthContext } from "../../../auth/AuthContextProvider";
import { TableState } from "../../TableStateProvider";
import "./Blind.scss";

export default function Blind() {
  const { user } = useContext(AuthContext);
  const { upNextId, sendCommand, blindSize } = useContext(TableState);
  const userIsUpNext = user?.uid === upNextId;

  const handlePick = () => {
    sendCommand({ name: COMMAND_TYPES.PICK, data: undefined });
  };

  const handlePass = () => {
    sendCommand({ name: COMMAND_TYPES.PASS, data: undefined });
  };

  return (
    <div className="Blind">
      {userIsUpNext && (
        <Button
          color="primary"
          variant="contained"
          className="Blind-VerticalButton"
          onClick={handlePick}
          children={<Typography variant="overline">Pick</Typography>}
        />
      )}
      <CardList
        cards={Array.from({ length: blindSize }, () => undefined)}
        overlap
      />
      {userIsUpNext && (
        <Button
          color="secondary"
          variant="contained"
          className="Blind-VerticalButton"
          onClick={handlePass}
          children={<Typography variant="overline">Pass</Typography>}
        />
      )}
    </div>
  );
}
