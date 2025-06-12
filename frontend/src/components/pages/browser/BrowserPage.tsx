import HomeIcon from "@mui/icons-material/Home";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { createSession, fetchSessionList } from "../../../api/session.api";
import { PLAYER_COUNT } from "../../../constants/game";
import { PATHS } from "../../../constants/url";
import { Session } from "../../../types/session";
import SessionsTable from "./SessionsTable";

export default function BrowserPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const loadSessions = useCallback(async () => {
    try {
      const response = await fetchSessionList();
      // Filter out in-progress sessions and sessions with 5 players
      const openSession = response.filter((session) => {
        return (
          !session.gameInProgress &&
          Object.keys(session.presence).length < PLAYER_COUNT
        );
      });
      setSessions(openSession);
    } catch (error) {
      setError("Failed to fetch sessions. Please try again later.");
      stopPolling();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load of sessions
    setLoading(true);
    loadSessions();
    intervalRef.current = setInterval(loadSessions, 5000);
    return () => stopPolling();
  }, [loadSessions]);

  const navigateToSession = (sessionId: string) => {
    navigate(PATHS.SESSION.replace(":sessionId", sessionId));
  };

  const handleCreateSession = async () => {
    try {
      const { sessionId } = await createSession();
      navigateToSession(sessionId);
    } catch (error) {
      alert("Failed to create session. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5">SESSION BROWSER</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreateSession}
            startIcon={<HomeIcon />}
          >
            Host Game
          </Button>
        </Stack>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="body1" align="center" color="error">
            {error}
          </Typography>
        ) : (
          <SessionsTable sessions={sessions} />
        )}
      </Paper>
    </Container>
  );
}
