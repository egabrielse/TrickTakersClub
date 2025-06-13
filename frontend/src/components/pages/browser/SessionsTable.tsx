import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PLAYER_COUNT } from "../../../constants/game";
import { useAppSelector } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import { Session } from "../../../types/session";
import SessionTableRow from "./SessionTableRow";

type SessionTableProps = {
  sessions: Session[];
};

export default function SessionsTable({ sessions }: SessionTableProps) {
  const uid = useAppSelector(authSlice.selectors.uid);
  // Sessions where the user is a player in an active game
  // Or the player is the host (regardless of if the game is in progress)
  const [mySessions, setMySessions] = useState<Session[]>([]);
  // Sessions that are open for the user to join
  const [openSessions, setOpenSessions] = useState<Session[]>([]);

  useEffect(() => {
    const newSessions = [];
    const newMySessions = [];
    for (const session of sessions) {
      if (session.gameInProgress && session.gameSeating.includes(uid)) {
        // Game in progress and user is seated in it
        newMySessions.push(session);
      } else if (session.hostId === uid) {
        // User is host
        newMySessions.push(session);
      } else if (Object.keys(session.presence).length < PLAYER_COUNT) {
        // Game not started and has open seats
        newSessions.push(session);
      }
    }
    setOpenSessions(newSessions);
    setMySessions(newMySessions);
  }, [sessions, uid]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon />
                <Typography variant="subtitle1">Players</Typography>
              </Stack>
            </TableCell>
            <TableCell>
              <Stack direction="row" spacing={1} alignItems="center">
                <HomeIcon />
                <Typography variant="subtitle1">Host</Typography>
              </Stack>
            </TableCell>
            <TableCell>
              <Stack direction="row" spacing={1} alignItems="center">
                <SettingsIcon />
                <Typography variant="subtitle1">Game Settings</Typography>
              </Stack>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mySessions.length > 0 && (
            <>
              <TableRow>
                <TableCell
                  size="small"
                  colSpan={3}
                  sx={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <Typography variant="body2">My Sessions</Typography>
                </TableCell>
              </TableRow>
              {mySessions.map((session) => (
                <SessionTableRow key={session.id} session={session} />
              ))}
              <TableRow>
                <TableCell
                  size="small"
                  colSpan={3}
                  sx={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <Typography variant="body2">Open Sessions</Typography>
                </TableCell>
              </TableRow>
            </>
          )}
          {openSessions.length > 0 ? (
            openSessions.map((session) => (
              <SessionTableRow key={session.id} session={session} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No open sessions found to join.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
