import { Button } from "@mui/material";
import { ReactNode } from "react";
import { useNavigate } from "react-router";
import { PATHS } from "../../constants/path";
import HomeIcon from '@mui/icons-material/Home';

export default function ReturnHomeButton(): ReactNode {
  const navigate = useNavigate();
  const returnHome = () => navigate(PATHS.ROOT);

  return (
    <Button
      className="ReturnHomeButton"
      onClick={returnHome}
      children="Return Home"
      variant="contained"
      color="primary"
      startIcon={<HomeIcon />}
    />
  );
}