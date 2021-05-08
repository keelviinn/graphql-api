import { productQueries } from './product';
import { showcaseQueries } from './showcase';

export const Queries = `
  type Query {
    ${productQueries}
    ${showcaseQueries}
  }
`;
