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

const login = `
  login(email: String password: String): Auth
`;

export const authTypeDefs = `
  ${RefreshToken}
  ${Auth}
`;

export const authQueries = `
  ${currentUser}
`;

export const authMutations = `
  ${login}
`;