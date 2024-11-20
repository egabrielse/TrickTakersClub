import { ReactNode } from "react";
import { Outlet } from "react-router";
import "./RootLayout.scss";

export default function RootLayout(): ReactNode {
  return (
    <div className="RootLayout">
      <Outlet />
    </div>
  );
}
