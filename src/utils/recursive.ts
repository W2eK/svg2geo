function callRecursive<T, U>(fn: (arg: T) => U) {
  return function recursion(arg: T | T[]): U | U[] {
    if (Array.isArray(arg)) {
      return arg.map(recursion) as U[];
    } else {
      return fn(arg);
    }
  };
}

export default callRecursive;
