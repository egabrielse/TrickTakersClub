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
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createSession, fetchSessionList } from "../../../api/session.api";
import { PATHS } from "../../../constants/url";
import { Session } from "../../../types/session";
import SessionsTable from "./SessionsTable";

export default function BrowserPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      const response = await fetchSessionList();
      setSessions(response);
    } catch (error) {
      setError("Failed to fetch sessions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load of sessions
    setLoading(true);
    loadSessions();
    const interval = setInterval(loadSessions, 5000);
    return () => clearInterval(interval);
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
            color="primary"
            onClick={handleCreateSession}
            startIcon={<HomeIcon />}
          >
            Host Session
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
