export function withWatch<T>(asyncIterator: AsyncIterator<T | undefined>, onStart: () => void, onClosed: () => void): AsyncIterator<T | undefined> {
  return {
    ...asyncIterator,
    next() {
      onStart();
      return asyncIterator.next ? asyncIterator.next() : Promise.resolve({ value: undefined, done: true });
    },
    return() {
      onClosed();
      return asyncIterator.return ? asyncIterator.return() : Promise.resolve({ value: undefined, done: true });
    },
    throw(err) {
      console.error(err)
      return asyncIterator.throw ? asyncIterator.throw() : Promise.resolve({ value: undefined, done: true });
    }
  }
}