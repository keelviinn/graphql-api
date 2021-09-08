import { withFilter } from 'graphql-subscriptions';
import { pubsub } from '../../config/redisClient';

export const NEW_USER_ADDED = 'NEW_USER_ADDED'

export const userAdded = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(NEW_USER_ADDED), 
    (payload, variables) => true
  )
}

export const userSubscriptions = { userAdded };