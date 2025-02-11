import { ReactNode } from "react";
import { Outlet } from "react-router";
import HeaderBar from "./HeaderBar/HeaderBar";
import "./HeaderLayout.scss";

export default function HeaderLayout(): ReactNode {
  return (
    <div className="HeaderLayout">
      <HeaderBar />
      <div className="HeaderLayout-Content">
        <Outlet />
      </div>
    </div>
  );
}
