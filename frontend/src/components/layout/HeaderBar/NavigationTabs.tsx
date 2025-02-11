import { Tab, Tabs } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { HEADER_PAGE_TABS } from "../../../constants/header";
import { Path } from "../../../types/url";

export default function NavigationTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = Object.values(HEADER_PAGE_TABS).find(
    (tab) => tab.path === location?.pathname,
  );

  const handleOnClick = (path: Path) => {
    navigate(path);
  };

  return (
    <Tabs value={currentTab?.id || false} textColor="inherit">
      {Object.values(HEADER_PAGE_TABS).map((page) => (
        <Tab
          key={page.id}
          id={`nav-tab-${page.id}`}
          value={page.id}
          onClick={() => handleOnClick(page.path)}
          label={page.label}
        />
      ))}
    </Tabs>
  );
}
