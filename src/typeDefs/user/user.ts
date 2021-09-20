export const Date = `
  scalar Date
`;

export const User = `
  type User {
    _id: String
    name: String
    email: String
    active: Boolean
    role: String
    coverURL: String
    accessToken: String
    refreshToken: String
    createdAt: String
    updatedAt: String
  }
`;

export const UserResult = `
  type UserResult {
    docs: [User]
    paginateProps: PaginateProps
  }
`;

export const users = `
  users (
    page: Int
    limit: Int
  ): UserResult
`;

export const user = `
  user(_id: String): User
`;

export const addUser = `
  addUser(
    name: String
    email: String
    password: String
    coverURL: String
    role: String
  ): User
`;

export const updateUser = `
  updateUser(
    _id: String
    email: String
    name: String
    password: String
    coverURL: String
    role: String
  ): User
`;

export const removeUser = `
  removeUser(_id: String): Boolean
`;

export const userAdded = `
  userAdded: User
`;

export const userConnection = `
  userConnection: User
`;

export const userTypeDefs = `
  ${Date}
  ${User}
  ${UserResult}
`;

export const userQueries = `
  ${users}
  ${user} 
`;

export const userMutations = `
  ${addUser}
  ${updateUser}
  ${removeUser}
`;

export const userSubscriptions = `
  ${userAdded}
  ${userConnection}
`;