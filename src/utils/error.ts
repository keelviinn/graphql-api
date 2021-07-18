import { ApolloError } from 'apollo-server-errors';

export class ApplicationError extends ApolloError {
  constructor(message: string) {
    super(message, '401');

    Object.defineProperty(this, 'name', { value: 'ApplicationError' });
  }
}