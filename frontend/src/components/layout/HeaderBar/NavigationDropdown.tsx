import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { HEADER_PAGE_TABS } from "../../../constants/header";
import { Path } from "../../../types/url";

export default function NavigationDropdown() {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOnClick = (path: Path) => {
    handleCloseNavMenu();
    navigate(path);
  };

  return (
    <>
      <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
        <MenuIcon />
      </IconButton>
      <Menu
        id="nav-menu"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {Object.values(HEADER_PAGE_TABS).map((page) => (
          <MenuItem
            key={page.id}
            id={`nav-dropdown-${page.id}`}
            onClick={() => handleOnClick(page.path)}
            selected={location.pathname === page.path}
          >
            <Typography sx={{ textAlign: "center" }}>{page.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
