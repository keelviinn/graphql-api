import { productQueries } from './product';
import { showcaseQueries } from './showcase';
import { userQueries } from './user';
import { authQueries } from './auth'

export const Queries = `
  type Query {
    ${productQueries}
    ${showcaseQueries}
    ${userQueries}
    ${authQueries}
  }
`;
