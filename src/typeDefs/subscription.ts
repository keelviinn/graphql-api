import { userSubscriptions } from './user';

export const Subscriptions = `
  type Subscription {
    ${userSubscriptions}
  }
`;