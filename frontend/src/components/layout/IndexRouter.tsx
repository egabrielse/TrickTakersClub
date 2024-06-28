import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { PATHS } from "../../constants/path";

export default function IndexRouter() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(PATHS.HOME);
  }, [navigate]);
  return <Outlet />;
}
