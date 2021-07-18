import { productQueries } from './product';
import { showcaseQueries } from './showcase';
import { userQueries } from './user';

export const Queries = `
  type Query {
    ${productQueries}
    ${showcaseQueries}
    ${userQueries}
  }
`;
