import { Divider, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { createSession } from "../../../api/session.api";
import { PATHS } from "../../../constants/url";
import { useAppSelector } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import ActionButton from "../../common/ActionButton";
import PageTopper from "../../common/PageTopper";
import FeaturesList from "./FeaturesList";
import "./HomePage.scss";

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(authSlice.selectors.isAuthenticated);
  const [loading, setLoading] = useState(false);

  const navigateToSession = (sessionId: string) => {
    navigate(PATHS.SESSION.replace(":sessionId", sessionId));
  };

  const navigateToBrowser = () => {
    navigate(PATHS.BROWSER);
  };

  const handleCreateSession = async () => {
    setLoading(true);
    if (!isAuthenticated) {
      navigate(PATHS.LOGIN);
      setLoading(false);
    } else {
      try {
        const { sessionId } = await createSession();
        navigateToSession(sessionId);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="HomePage">
      <PageTopper
        pre="Welcome to"
        title="Trick Takers Club"
        post={import.meta.env.VITE_REF_NAME}
      />
      <div className="HomePage-Tiles">
        <Paper className="HomePage-Tiles-Tile">
          Hello! Welcome to Trick Takers Club, a place to play Sheepshead online
          with friends. This site is a work in progress and is being developed
          by a single person in their free time. I'm excited to continue adding
          new features and improving the site.
        </Paper>
        <Paper className="HomePage-Tiles-Tile">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "space-between",
              gap: "1rem",
              flex: 1,
            }}
          >
            <div className="HomePage-Tiles-Tile-Header">
              <h1>PLAY SHEEPSHEAD!</h1>
            </div>
            <ActionButton
              label="Host Game"
              onClick={handleCreateSession}
              disabled={loading}
            />
            <Divider orientation="horizontal" color="white" />
            <ActionButton
              color="secondary"
              label="Browse Open Games"
              disabled={loading}
              type="submit"
              onClick={navigateToBrowser}
            />
          </div>
        </Paper>
        <Paper className="HomePage-Tiles-Tile">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              flex: 1,
            }}
          >
            <iframe
              width="100%"
              className="HomePage-Tiles-Tile-Video"
              src="https://www.youtube.com/embed/pIbIIEHAM68?si=6V0VaRaWOGZhUVIA"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </Paper>
        <Paper className="HomePage-Tiles-Tile">
          <FeaturesList />
        </Paper>
      </div>
    </div>
  );
}
