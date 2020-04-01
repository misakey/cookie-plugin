import { WebExtensionBlocker, fullLists, fetchLists, fetchResources } from '@cliqz/adblocker-webextension';
import pullAllWith from 'lodash/pullAllWith';
import { isRequestWhitelisted } from 'background/store';
import { RESOURCE_URL } from 'background/config';

const DEFAULT_PURPOSE = 'advertising';
const RULES_LIST = [
  ...fullLists,
  `${RESOURCE_URL}/networkAdvertising.txt`,
  `${RESOURCE_URL}/networkAnalytics.txt`,
  `${RESOURCE_URL}/cosmetic.txt`,
];

/**
 * Initialize the adblocker using lists of filters and resources. It returns a
 * Promise resolving on the `Engine` that we will use to decide what requests
 * should be blocked or altered.
 */
async function loadAdblocker() {
  return WebExtensionBlocker.fromCached(() => {
    const listsPromises = fetchLists(fetch, RULES_LIST);
    const resourcesPromise = fetchResources(fetch);

    return Promise.all([listsPromises, resourcesPromise]).then(async ([lists, resources]) => {
      const remoteRules = lists.join('\n');
      const whitelistAsText = await (await fetch(`${RESOURCE_URL}/whitelist.txt`)).text();

      const rules = pullAllWith(
        remoteRules.split(/\n/g),
        whitelistAsText.split(/\n/g),
        (ruleVal, whitelistVal) => ruleVal.trim() === whitelistVal.trim(),
      );

      const engine = WebExtensionBlocker.parse(rules.join('\n'), { enableCompression: true, enableHtmlFiltering: true });
      if (resources !== undefined) {
        engine.updateResources(resources, `${resources.length}`);
      }

      return engine;
    });
  });
}

function isRequestFirstParty(initiatorDomain, targetDomain) {
  return initiatorDomain === targetDomain;
}

function getPurpose(filter) {
  // Try to recreate the original rule of the filter (adblock syntax)
  const originRule = filter.toString();

  const { hostname } = filter;
  if (hostname && (hostname.match(/taboola.com/) || hostname.match(/outbrain.com/))) { return 'advertising'; }

  if (originRule.match(/analytics/)) { return 'analytics'; }
  if (originRule.match(/googleadservices/) || originRule.match(/doubleclick/)) { return 'advertising'; }
  if (originRule.match(/facebook/) || originRule.match(/twitter/)) { return 'social_interaction'; }

  if (hostname && (hostname.match(/taboola/) || hostname.match(/outbrain/))) { return 'advertising'; }

  if (originRule.match(/newsletter/) || originRule.match(/rss/)) { return 'social_interaction'; }

  return DEFAULT_PURPOSE;
}

function getBlockingResponse(engine, request) {
  const { redirect, match, filter } = engine.match(request);

  // The request didn't match, no need to process the rest of the treatment
  if (redirect === undefined && match === false) {
    return { blockingResponse: {}, filter: null };
  }

  const { sourceDomain, hostname, domain } = request;

  // @TODO: delete details.type === 'main_frame' when we will have associated domains info
  if (isRequestFirstParty(sourceDomain, domain) || request.isMainFrame()) {
    return { blockingResponse: {}, filter: null };
  }

  if (isRequestWhitelisted(hostname)) {
    return { blockingResponse: {}, filter };
  }

  if (redirect !== undefined) {
    return { blockingResponse: { redirectUrl: redirect.dataUrl }, filter };
  }

  if (match === true) {
    return { blockingResponse: { cancel: true }, filter };
  }

  return {};
}


export { getBlockingResponse, loadAdblocker, getPurpose, RULES_LIST };
