import { ERROR_MESSAGES } from "./constants.js";
import { apiUrl, replaceHostTokens, resolveHost } from "./hosts.js";

/**
 * @param {string} value
 * @returns {Array<Array<string | number>>}
 */
const parseApiCommands = (value) => {
  if (!value) return [];
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch (error) {
    console.error(ERROR_MESSAGES.PARSE_DATA_API, error);
    throw error;
  }
  if (!Array.isArray(parsed)) {
    const error = new Error(ERROR_MESSAGES.INVALID_DATA_API);
    console.error(error.message, parsed);
    throw error;
  }
  if (!parsed.length) return [];
  return parsed.every(Array.isArray) ? parsed : [parsed];
};

export {
  apiUrl,
  parseApiCommands,
  replaceHostTokens,
  resolveHost,
};

/**
 * @param {Document} doc
 * @param {typeof fetch} [fetcher]
 * @returns {{
 *   elements: Record<string, HTMLElement | null>
 * } | null}
 */
export const initApp = (doc, fetcher = fetch) => {
  return {
    elements: {},
  };
};
