/*
 * @Author: bird
 * @Date: 2020-11-04 22:26:35
 * @LastEditors: bird
 * @LastEditTime: 2020-11-04 22:35:26
 * @FilePath: /mtyun-oss-web/src/utils/sort.js
 */
/**
 * Natural sort comparator for strings.
 *
 * @param {Number} dir - sorting direction, 1 for ascending or -1 for descending
 * @param {Intl.CollatorOptions} opts - localeCompare options (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)
 * @returns {(a:string, b:string) => number}
 */
export function sortByName(dir = 1, opts = { numeric: true, sensitivity: 'base' }) {
  return (a, b) => a.localeCompare(b, undefined, opts) * dir;
}

/**
 * Numerical sort comparator.
 *
 * @param {Number} dir - sorting direction, 1 for ascending or -1 for descending
 * @returns {(a:number, b:number) => number}
 */
export function sortBySize(dir = 1) {
  return (a, b) => (a - b) * dir;
}

/**
 * Object sorting by property
 * @template {Object} T
 * @param {keyof T} property - object property to sort by
 * @param {1|-1} dir - sorting direction, 1 for ascending or -1 for descending
 * @returns {(a:T, b:T) => number}
 */
export function sortByProperty(property, dir = 1) {
  // @ts-ignore - `a` and `b` may not be numbers
  return ({ [property]: a }, { [property]: b }) =>
    (a == null) - (b == null) || dir * +(a > b) || dir * -(a < b);
}

export const IS_MAC = navigator.userAgent.indexOf('Mac') !== -1;
export const SORTING = {
  /** @type {'name'} */
  BY_NAME: 'name',
  /** @type {'size'} */
  BY_SIZE: 'size',
};

/**
 * @template {{name:string, type:string, cumulativeSize?:number, size:number}} T
 * @param {T[]} files
 * @param {Sorting} sorting

 * @returns {T[]}
 */
export const sortFiles = (files, sorting = { by: 'name', asc:true }) => {
  const sortDir = sorting.asc ? 1 : -1;
  const nameSort = sortByName(sortDir);
  const sizeSort = sortBySize(sortDir);

  return files.sort((a, b) => {
    if (a.type === b.type || IS_MAC) {
      if (sorting.by === SORTING.BY_NAME) {
        return nameSort(a.name, b.name);
      }
        return sizeSort(a.cumulativeSize || a.size, b.cumulativeSize || b.size);

    }

    if (a.type === 'directory') {
      return -1;
    }
      return 1;

  });
};
