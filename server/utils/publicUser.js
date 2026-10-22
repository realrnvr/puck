export const toPublicUser = (user) => {
  if (!user) {
    return null;
  }

  const id = user._id ?? user.id;

  return {
    ...(id ? { id: String(id) } : {}),
    username: user.username,
    email: user.email,
    type: user.type,
    isVerified: Boolean(user.isVerified),
  };
};
