import React from "react";
import ParentSidebar from "./ParentSidebar";
import DaycareSidebar from "./DaycareSidebar";
import { isParentRole } from "../../utils/roles";

const Sidebar = ({ closeDrawer }) => {
  if (isParentRole()) {
    return <ParentSidebar closeDrawer={closeDrawer} />;
  }

  return <DaycareSidebar closeDrawer={closeDrawer} />;
};

export default Sidebar;

