import { productQueries } from './product';
import { showcaseQueries } from './showcase';
import { userQueries } from './user';
import { refreshTokenQueries } from './auth';

export const Queries = `
  type Query {
    ${productQueries}
    ${showcaseQueries}
    ${userQueries}
    ${refreshTokenQueries}
  }
`;
