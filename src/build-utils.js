import { apiUrl, parseApiCommands, replaceHostTokens } from "./logic.js";

/**
 * @param {string} attrs
 * @param {string} name
 * @returns {string | null}
 */
const parseDataAttribute = (attrs, name) => {
  const match = attrs.match(new RegExp(`${name}=("|')(.*?)\\1`, "i"));
  return match ? match[2] : null;
};

/**
 * @param {string} href
 * @param {string} [sourceUrl]
 * @returns {string}
 */
const appendSourceUrl = (href, sourceUrl = "http://tv.ze.gs") => {
  if (href.includes("url=")) {
    return href;
  }

  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}url=${sourceUrl}`;
};

/**
 * @param {string} html
 * @param {{ allowedPrefix?: string }} [options]
 * @returns {string}
 */
const rewriteLinksForNoJs = (html, { allowedPrefix = "http://a.ze.gs/" } = {}) =>
  html.replace(/<a([^>]*?)>/gi, (tag, attrs) => {
    const hrefMatch = attrs.match(/\shref=("|')(.*?)\1/i);
    if (!hrefMatch) {
      return tag;
    }

    const dataApi = parseDataAttribute(attrs, "data-api");

    let href = null;
    if (dataApi) {
      try {
        const apiCommands = parseApiCommands(dataApi);
        const [primaryArgs] = apiCommands;
        if (primaryArgs) {
          href = apiUrl(replaceHostTokens(primaryArgs));
        }
      } catch (error) {
        console.error("Failed to parse data-api payload", error);
        href = null;
      }
    }

    if (!href || !href.startsWith(allowedPrefix)) {
      return tag;
    }

    const hrefWithSource = appendSourceUrl(href);
    return tag.replace(hrefMatch[0], ` href="${hrefWithSource}"`);
  });

/**
 * @param {string} html
 * @param {Array<(html: string) => string>} [transforms]
 * @returns {string}
 */
export const applyHtmlTransforms = (html, transforms = [rewriteLinksForNoJs]) =>
  transforms.reduce((current, transform) => transform(current), html);

export { appendSourceUrl, rewriteLinksForNoJs };
