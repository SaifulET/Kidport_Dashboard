import React from "react";
import ParentHeader from "./ParentHeader";
import DaycareHeader from "./DaycareHeader";
import { isParentRole } from "../../utils/roles";

const Header = ({ showDrawer }) => {
  if (isParentRole()) {
    return <ParentHeader showDrawer={showDrawer} />;
  }

  return <DaycareHeader showDrawer={showDrawer} />;
};

export default Header;

