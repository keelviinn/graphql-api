export const RefreshToken = `
  type RefreshToken {
    _id: String
    expiration: Date
    user: String
    createdAt: String
    updatedAt: String
  }
`;

export const Auth = `
  type Auth {
    token: String
    refreshToken: String
    user: User
  }
`;

const currentUser = `
  currentUser: User
`;

const me = `
  me: User
`;

const register = `
  register(
    email: String!
    name: String!
    password: String!
  ): Boolean!
`

const login = `
  login(
    email: String! 
    password: String!
  ): User
`;

const invalidTokens = `
  invalidTokens: Boolean!
`;

export const authTypeDefs = `
  ${RefreshToken}
  ${Auth}
`;

export const authQueries = `
  ${currentUser}
  ${me}
`;

export const authMutations = `
  ${register}
  ${login}
  ${invalidTokens}
`;