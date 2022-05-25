const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers', 'event'],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
