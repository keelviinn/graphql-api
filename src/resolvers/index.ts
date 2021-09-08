import { productQueries, productMutations } from './product';
import { showcaseQueries, showcaseMutations } from './showcase';
import { authQueries, authMutations } from './auth';
import { userQueries, userMutations, userSubscriptions } from './user';

const resolvers = {
	Query: {
		...productQueries,
		...showcaseQueries,
		...authQueries,
		...userQueries,
  },
	Mutation: {
		...productMutations,
		...showcaseMutations,
		...authMutations,
		...userMutations,
	},
	Subscription: {
		...userSubscriptions,
	}
}

export default resolvers;
