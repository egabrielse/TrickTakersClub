import { ReactNode } from "react";
import { Outlet } from "react-router";
import PopupDialog from "../dialog/PopupDialog";
import "./RootLayout.scss";

export default function RootLayout(): ReactNode {
  return (
    <>
      <PopupDialog />
      <div className="RootLayout">
        <Outlet />
      </div>
    </>
  );
}
