import { Queries } from './queries';
import { Mutations } from './mutations';
import { productTypeDefs } from './product';
import { showcaseTypeDefs } from './showcase';
 
const typeDefs = `
${Queries}
${Mutations}
${productTypeDefs}
${showcaseTypeDefs}
` 
export default typeDefs;
