export const USER_ROLES = Object.freeze({
  PARENT: "parent",
  DAYCARE: "daycare",
});

const LEGACY_ROLE_MAP = {
  terminal: USER_ROLES.PARENT,
  dashboard: USER_ROLES.DAYCARE,
};

export const getCurrentRole = () => {
  const role = localStorage.getItem("role");

  if (role === USER_ROLES.PARENT || role === USER_ROLES.DAYCARE) {
    return role;
  }

  return LEGACY_ROLE_MAP[role] || USER_ROLES.PARENT;
};

export const isParentRole = () => getCurrentRole() === USER_ROLES.PARENT;
