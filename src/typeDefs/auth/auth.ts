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
    refreshToken: RefreshToken
  }
`;

const login = `
  login(email: String password: String): Auth
`;

const refreshToken = `
  refreshToken(refresh_token: String): Auth
`;

export const authTypeDefs = `
  ${RefreshToken}
  ${Auth}
`;

export const authMutations = `
  ${login}
  ${refreshToken}
`;