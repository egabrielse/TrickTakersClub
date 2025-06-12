import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import { CALLING_METHODS, NO_PICK_RESOLUTIONS } from "../../../constants/game";
import { PATHS } from "../../../constants/url";
import { Session } from "../../../types/session";
import DisplayName from "../../common/Profile/DisplayName";
import ProfilePic from "../../common/Profile/ProfilePic";
import ProfileProvider from "../../common/Profile/ProfileProvider";

type SessionTableProps = {
  sessions: Session[];
};

export default function SessionsTable({ sessions }: SessionTableProps) {
  console.log("SessionsTable", sessions);
  const navigate = useNavigate();

  const navigateToSession = (sessionId: string) => {
    navigate(PATHS.SESSION.replace(":sessionId", sessionId));
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon />
                <span>Players</span>
              </Stack>
            </TableCell>
            <TableCell>
              <Stack direction="row" spacing={1} alignItems="center">
                <HomeIcon />
                <span>Host</span>
              </Stack>
            </TableCell>
            <TableCell>
              <Stack direction="row" spacing={1} alignItems="center">
                <SettingsIcon />
                <span>Game Settings</span>
              </Stack>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(sessions).length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No active sessions found.
              </TableCell>
            </TableRow>
          ) : (
            sessions.map((session) => (
              <TableRow
                key={session.id}
                hover
                onClick={() => navigateToSession(session.id)}
              >
                <TableCell>
                  <Typography variant="body1">
                    {Object.keys(session.presence).length}/5
                  </Typography>
                </TableCell>
                <TableCell>
                  <ProfileProvider uid={session.hostId}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ProfilePic size="small" />
                      <DisplayName />
                    </Stack>
                  </ProfileProvider>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {session.gameSettings.callingMethod && (
                      <Chip
                        key="calling-method"
                        label={
                          CALLING_METHODS[session.gameSettings.callingMethod]
                            .LABEL
                        }
                        sx={{ backgroundColor: "blue", color: "#fff" }}
                        size="small"
                      />
                    )}
                    {session.gameSettings.noPickResolution && (
                      <Chip
                        key="no-pick-resolution"
                        label={
                          NO_PICK_RESOLUTIONS[
                            session.gameSettings.noPickResolution
                          ].LABEL
                        }
                        sx={{ backgroundColor: "#fcc200", color: "#fff" }}
                        size="small"
                      />
                    )}
                    {session.gameSettings.doubleOnTheBump && (
                      <Chip
                        key="double-on-the-bump"
                        label={"Double on the Bump"}
                        sx={{ backgroundColor: "red", color: "#fff" }}
                        size="small"
                      />
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
