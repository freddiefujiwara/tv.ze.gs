import { DATA_API_DELAY_MS, ERROR_MESSAGES } from "./constants.js";
import {
  apiUrl,
  parseApiCommands,
  replaceHostTokens,
} from "./logic.js";

/**
 * @param {Document} doc
 * @param {string} selector
 * @param {(link: HTMLAnchorElement) => Promise<void>} handler
 */
const bindLinkClicks = (doc, selector, handler) => {
  doc.querySelectorAll(selector).forEach((link) =>
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      await handler(link);
    }),
  );
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const handleDataApi = async (fetcher, dataApi) => {
  try {
    const apiCommands = parseApiCommands(dataApi);
    for (let index = 0; index < apiCommands.length; index += 1) {
      await fetcher(apiUrl(replaceHostTokens(apiCommands[index])));
      if (DATA_API_DELAY_MS > 0 && index < apiCommands.length - 1) await delay(DATA_API_DELAY_MS);
    }
  } catch (error) {
    console.error(ERROR_MESSAGES.EXEC_COMMANDS, error);
  }
};

/**
 * @param {Document} doc
 * @param {typeof fetch} fetcher
 */
export const wireEvents = (doc, fetcher) => {
  bindLinkClicks(doc, "a[data-api]", async (link) => {
    if (link.dataset.api) await handleDataApi(fetcher, link.dataset.api);
  });
};

/**
 * @param {Document} [doc]
 * @param {typeof fetch} [fetcher]
 */
export const start = (doc = document, fetcher = fetch) => {
  doc.querySelectorAll("a").forEach((link) => link.setAttribute("href", "#"));
  wireEvents(doc, fetcher);
};

export const bootstrapBrowser = (doc = document, fetcher = fetch) => {
  start(doc, fetcher);
};
