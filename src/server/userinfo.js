export const getUserInfor = () => {
  const user = Session.getActiveUser().getEmail();
  return user;
};

