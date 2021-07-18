import { Queries } from './queries';
import { Mutations } from './mutations';
import { productTypeDefs } from './product';
import { showcaseTypeDefs } from './showcase';
import { userTypeDefs } from './user';
import { refreshTokenTypeDefs } from './auth';
 
const typeDefs = `
${Queries}
${Mutations}
${productTypeDefs}
${showcaseTypeDefs}
${userTypeDefs}
${refreshTokenTypeDefs}
` 
export default typeDefs;
