import { productQueries, productMutations } from './product';
import { showcaseQueries, showcaseMutations } from './showcase';

const resolvers = {
	Query: {
		...productQueries,
		...showcaseQueries,
  },
	Mutation: {
		...productMutations,
		...showcaseMutations,
	}
}

export default resolvers;
