import { withFilter,  } from 'graphql-subscriptions';
import { $$asyncIterator } from 'iterall';
import { onFinished, onStart, withStaticFields } from '../../utils/withWatch';
import { pubsub } from '../../config/redisClient';

export const NEW_USER_ADDED = 'NEW_USER_ADDED';
export const NEW_USER_CONNECTED = 'NEW_USER_CONNECTED';

export const userAdded = {
  subscribe: withFilter(
    () => { 
      const asyncIterator = pubsub.asyncIterator(NEW_USER_ADDED);
      withStaticFields(asyncIterator, () => console.log('teste'))
      return asyncIterator
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