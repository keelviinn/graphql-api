import { productQueries, productMutations } from './product';
import { showcaseQueries, showcaseMutations } from './showcase';
import { authQueries, authMutations } from './auth';
import { userMutations } from './user';

const resolvers = {
	Query: {
		...productQueries,
		...showcaseQueries,
		...authQueries,
  },
	Mutation: {
		...productMutations,
		...showcaseMutations,
		...authMutations,
		...userMutations,
	}
}

export default resolvers;
