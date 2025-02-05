import { ReactNode } from "react";
import { Outlet } from "react-router";
import DialogProvider from "../../dialog/DialogProvider";
import "./RootLayout.scss";

export default function RootLayout(): ReactNode {
  return (
    <DialogProvider>
      <div className="RootLayout">
        <Outlet />
      </div>
    </DialogProvider>
  );
}
