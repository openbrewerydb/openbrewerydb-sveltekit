import { defineParams } from '@sveltejs/kit/params';

/**
 * Parameter matcher for integer values
 * @param {string} param - The parameter to check
 * @returns {boolean} True if the parameter is a valid integer
 */
function matchInteger(param: string): boolean {
  return /^\d+$/.test(param);
}

export const params = defineParams({
  integer: (param) => (matchInteger(param) ? param : undefined),
});
