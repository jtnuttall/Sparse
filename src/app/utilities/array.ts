interface Array<T> {
  /**
   * Finds all indices where the equality function provided returns true.
   *
   * @param eqFn The equality function.
   */
  findIndices(eqFn: (v: T) => boolean): Array<number>;

  /**
   * Insert an element into a sorted array, maintaining its order.
   *
   * @param elem The element to insert.
   * @param comparator The optional comparator function.
   */
  insertSorted(elem: T, comparator?: (first: T, second: T) => boolean): void;

  /**
   * Get the maximum value from an array of objects. The objects must be numeric
   * unless the getter is set.
   *
   * @param getter A function that gets a numeric from the given object.
   */
  maximum(getter?: (value: T) => number): T;

  /**
   * Get the sum of a numeric array.
   */
  sum(): number;
}

Array.prototype.findIndices = function<T>(eqFn: (v: T) => boolean): Array<number> {
  return this.reduce((r, n, i) => {
    if (eqFn(n)) {
      r.push(i);
    }

    return r;
  }, []);
};


Array.prototype.insertSorted = function<T>(elem: T, comparator?: (first: T, second: T) => boolean): void {
  if (!comparator) {
    comparator = (first, second) => first < second;
  }

  let index: number;
  for (index = 0; index < this.length; index += 1) {
    if (comparator(elem, this[index])) {
      break;
    }
  }

  this.splice(index, 0, elem);
};

Array.prototype.maximum = function<T>(getter?: (value: T) => number): T {
  return getter
    ? this.reduce((a, b) => Math.max(getter(a), getter(b)))
    : this.reduce((a, b) => Math.max(a, b));
};

Array.prototype.sum = function(): number {
  return this.reduce((a, b) => a + b, 0);
};
