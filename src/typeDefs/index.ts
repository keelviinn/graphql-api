import { Queries } from './queries';
import { Mutations } from './mutations';
import { paginatePropsTypeDefs } from './paginate';
import { productTypeDefs } from './product';
import { showcaseTypeDefs } from './showcase';
import { userTypeDefs } from './user';
import { authTypeDefs } from './auth';
  
 
const typeDefs = `
${Queries}
${Mutations}
${paginatePropsTypeDefs}
${productTypeDefs}
${showcaseTypeDefs}
${userTypeDefs}
${authTypeDefs}
` 
export default typeDefs;
