import { ReactNode } from "react";
import { Outlet } from "react-router";
import AdPlaceholder from "../common/AdPlaceholder";
import CustomDialog from "../dialog/CustomDialog";
import "./RootLayout.scss";

export default function RootLayout(): ReactNode {
  return (
    <>
      <CustomDialog />
      <div className="RootLayout">
        <aside className="RootLayout-LeftAside">
          <AdPlaceholder />
        </aside>
        <div className="RootLayout-Body">
          <Outlet />
        </div>
        <aside className="RootLayout-RightAside">
          <AdPlaceholder />
        </aside>
      </div>
    </>
  );
}
