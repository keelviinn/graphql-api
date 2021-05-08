import { productMutations } from './product';
import { showcaseMutations } from './showcase';

export const Mutations = `
  type Mutation {
    ${productMutations}
    ${showcaseMutations}
  }
`;