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
    role: String
    refreshToken: String
  }
`;

const getCurrentUser = `
  getCurrentUser: User
`;

const login = `
  login(email: String password: String): Auth
`;

export const authTypeDefs = `
  ${RefreshToken}
  ${Auth}
`;

export const authQueries = `
  ${getCurrentUser}
`;

export const authMutations = `
  ${login}
`;