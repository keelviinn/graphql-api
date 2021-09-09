import { $$asyncIterator } from 'iterall';

export const withStaticFields = (asyncIterator: AsyncIterator<any>, onStart: () => void): Function => {
  return (rootValue: any, args: any, context: any, info: any): any => {
    return {
      next() {
        return asyncIterator.next().then(({ value, done }) => {
          console.log(value, done)
          return { value: { ...value }, done };
        });
      },
      return() {
        return Promise.resolve({ value: undefined, done: true });
      },
      throw(error) {
        return Promise.reject(error);
      },
      [$$asyncIterator]() {
        return this;
      },
    };
  };
};

export function onStart<T>(asyncIterator: AsyncIterator<T | undefined>, onStart: () => void) {
  return {
    next() {
      return asyncIterator.next().then(({ value, done }) => {
        console.log(value, done)
        return { value: { ...value }, done };
      });
    }
  };
}

export async function onFinished<T>(asyncIterator: AsyncIterator<T | undefined>, onFinished: () => void) {
  if (asyncIterator.return) onFinished();
}