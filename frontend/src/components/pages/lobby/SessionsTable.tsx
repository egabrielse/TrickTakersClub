import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router";
import { CALLING_METHODS, NO_PICK_RESOLUTIONS } from "../../../constants/game";
import { PATHS } from "../../../constants/url";
import { Session } from "../../../types/session";

type SessionTableProps = {
  sessions: Session[];
};

export default function SessionsTable({ sessions }: SessionTableProps) {
  const navigate = useNavigate();

  const navigateToSession = (sessionId: string) => {
    navigate(PATHS.SESSION.replace(":sessionId", sessionId));
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Players</TableCell>
            <TableCell>Host</TableCell>
            <TableCell>Settings</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map((session) => (
            <TableRow
              key={session.id}
              hover
              onClick={() => navigateToSession(session.id)}
            >
              <TableCell>{Object.keys(session.presence).length}/5</TableCell>
              <TableCell align="right">{session.hostId}</TableCell>
              <TableCell align="right">
                {session.gameSettings.doubleOnTheBump && (
                  <Chip
                    key="double-on-bump"
                    label="Double on the Bump"
                    size="small"
                    sx={{ backgroundColor: "lightgreen", color: "#fff" }}
                  />
                )}
                {session.gameSettings.callingMethod && (
                  <Chip
                    key="calling-method"
                    label={
                      CALLING_METHODS[session.gameSettings.callingMethod].LABEL
                    }
                    sx={{ backgroundColor: "lightblue", color: "#fff" }}
                    size="small"
                  />
                )}
                {session.gameSettings.noPickResolution && (
                  <Chip
                    key="no-pick-resolution"
                    label={
                      NO_PICK_RESOLUTIONS[session.gameSettings.noPickResolution]
                        .LABEL
                    }
                    sx={{ backgroundColor: "lightblue", color: "#fff" }}
                    size="small"
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
