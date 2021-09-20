import { withFilter,  } from 'graphql-subscriptions';
import { $$asyncIterator } from 'iterall';
import { withWatch } from '../../utils/withWatch';
import { pubsub } from '../../config/redisClient';

export const NEW_USER_ADDED = 'NEW_USER_ADDED';
export const NEW_USER_CONNECTED = 'NEW_USER_CONNECTED'

export const userAdded = {
  subscribe: withFilter(
    (root, args, context, info) => {
      // console.log(root, args, context)
      return pubsub.asyncIterator(NEW_USER_ADDED)
      // return withWatch(
      //   pubsub.asyncIterator(NEW_USER_ADDED),
      //   () => console.log('conexao startada'),
      //   () => console.log('conexao finalizada')
      // )
    }, 
    (payload, variables) => true
  )
}

export const userConnection = {
  subscribe: withFilter(
    () => {
      return pubsub.asyncIterator(NEW_USER_CONNECTED)
    }, 
    (payload, variables) => true
  )
}

export const userSubscriptions = { userAdded, userConnection };