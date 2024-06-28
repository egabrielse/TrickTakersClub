import { ReactNode } from "react";
import { Outlet } from "react-router";
import AdPlaceholder from "../common/AdPlaceholder";
import CustomDialog from "../dialog/CustomDialog";
import Header from "../header/Header";
import "./RootLayout.scss";

export default function RootLayout(): ReactNode {
  return (
    <>
      <CustomDialog />
      <div className="RootLayout">
        <Header />
        <aside className="RootLayout-LeftAside">
          <AdPlaceholder />
        </aside>
        <main className="RootLayout-Body">
          <Outlet />
        </main>
        <aside className="RootLayout-RightAside">
          <AdPlaceholder />
        </aside>
      </div>
    </>
  );
}
