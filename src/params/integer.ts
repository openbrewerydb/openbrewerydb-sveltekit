/**
 * Parameter matcher for integer values
 * @param {string} param - The parameter to check
 * @returns {boolean} True if the parameter is a valid integer
 */
export function match(param: string): boolean {
  return /^\d+$/.test(param);
}
