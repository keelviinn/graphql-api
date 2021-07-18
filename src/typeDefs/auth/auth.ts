export const RefreshToken = `
  type RefreshToken {
    _id: String
    token: String
    expiration: Date
    issued: Date
    select: Boolean
    createdAt: String
    updatedAt: String
  }
`;

export const AuthResponse = `
  type AuthResponse {
    status: String
    message: String
    token: String
    data: User
  }  
`
export const isLoggedIn = `
  isLoggedIn: AuthResponse
`;

export const sendAuthLink = `
  sendAuthLink(email: String): AuthResponse
`;

export const verifyAuthLink = `
  verifyAuthLink(token: String): AuthResponse
`;

export const logout = `
  logout: AuthResponse
`;

export const refreshTokenTypeDefs = `
  ${RefreshToken}
  ${AuthResponse}
`;

export const refreshTokenQueries = `
  ${isLoggedIn}
`;

export const refreshTokenMutations = `
  ${sendAuthLink}
  ${verifyAuthLink}
  ${logout}
`;