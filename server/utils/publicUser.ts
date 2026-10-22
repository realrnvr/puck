export interface PublicUserSource {
  _id?: unknown;
  id?: unknown;
  username?: string | null;
  email?: string | null;
  type?: string | null;
  isVerified?: boolean | null;
}

export interface PublicUser {
  id?: string;
  username?: string | null;
  email?: string | null;
  type?: string | null;
  isVerified: boolean;
}

export const toPublicUser = (
  user: PublicUserSource | null | undefined,
): PublicUser | null => {
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
