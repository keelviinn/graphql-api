import { productMutations } from './product';
import { showcaseMutations } from './showcase';
import { userMutations } from './user';
import { authMutations } from './auth';

export const Mutations = `
  type Mutation {
    ${productMutations}
    ${showcaseMutations}
    ${userMutations}
    ${authMutations}
  }
`;