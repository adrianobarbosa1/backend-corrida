const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers', 'createEvent'],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
