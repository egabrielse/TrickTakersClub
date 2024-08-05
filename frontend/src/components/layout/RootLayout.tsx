import { ReactNode } from "react";
import { Outlet } from "react-router";
import AdPlaceholder from "../common/AdPlaceholder";
import CustomDialog from "../dialog/CustomDialog";
import AppHeader from "../header/AppHeader";
import "./RootLayout.scss";

export default function RootLayout(): ReactNode {
  return (
    <>
      <CustomDialog />
      <div className="RootLayout">
        <header className="RootLayout-Header" style={{ gridArea: "HEADER" }}>
          <AppHeader />
        </header>
        <aside className="RootLayout-Aside" style={{ gridArea: "LEFT" }}>
          <AdPlaceholder type="vertical" />
        </aside>
        <main className="RootLayout-Body" style={{ gridArea: "BODY" }}>
          <Outlet />
        </main>
        <aside className="RootLayout-Aside" style={{ gridArea: "RIGHT" }}>
          <AdPlaceholder type="vertical" />
        </aside>
      </div>
    </>
  );
}
