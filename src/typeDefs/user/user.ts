export const Date = `
  scalar Date
`

export const User = `
  type User {
    _id: String
    name: String
    email: String
    authLoginToken: String
    authLoginExpires: Date
    refreshTokens: [RefreshToken]
    active: Boolean
    role: String
    coverURL: String
    createdAt: String
    updatedAt: String
  }
`;

export const UserResult = `
  type UserResult {
    list: [User]
    totalPages: Int
    totalCount: Int
  }
`;

export const users = `
  users: UserResult
`

export const user = `
  user(_id: String): User
`

export const addUser = `
  addUser(
    name: String
    price: Float
    coverURL: String
  ): User
`

export const updateUser = `
  updateUser(
    _id: String
    name: String
    price: Float
    coverURL: String
  ): User
`

export const removeUser = `
  removeUser(_id: String): Boolean
`

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