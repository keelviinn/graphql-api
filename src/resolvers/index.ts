import { productQueries, productMutations } from './product';
import { showcaseQueries, showcaseMutations } from './showcase';
import { authQueries, authMutations } from './auth';

const resolvers = {
	Query: {
		...productQueries,
		...showcaseQueries,
		...authQueries,
  },
	Mutation: {
		...productMutations,
		...showcaseMutations,
		...authMutations
	}
}

export default resolvers;
