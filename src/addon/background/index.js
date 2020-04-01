/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import common from '@misakey/ui/colors/common';

import { Request } from '@cliqz/adblocker-webextension';
import { loadAdblocker, getBlockingResponse, getPurpose } from 'background/engine';
import {
  setBadgeTextColor,
  updateActiveRequestsCounter,
  toggleBadgeAndIconOnPaused,
  log,
} from 'helpers/browserActions';
import { setCurrentTabId, deleteInfoForTab } from 'store/actions/websites';
import { openInNewTab } from 'helpers/tabs';
import { addToDetectedRequests, setDetectedRequestsForTabId, removeTabIdFromDetectedRequests } from 'store/actions/thirdparty';
import store, { loadStorage, dispatch, getDetectedRequestsCountForTabId } from 'background/store';
import { parse } from 'tldts';
import { getBrowserInfo } from 'helpers/devices';
import { showWarning } from 'store/actions/warning';

function handleConfig() {
  loadStorage().then(() => {
    const pausedState = store.getState().pause.pause;
    toggleBadgeAndIconOnPaused(pausedState);
  });
  const { name, version } = getBrowserInfo();
  if (name === 'firefox' && version >= 63) {
    setBadgeTextColor(common.white);
  }
}

function handleTabs() {
  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.url) {
      dispatch(deleteInfoForTab(tabId));
    }
  });

  browser.tabs.onActivated.addListener(({ tabId }) => {
    if (tabId > -1) {
      // Popup extension has a tab = -1 : we don't want
      // to update counter if it's the 'newTab' is the popup
      updateActiveRequestsCounter(tabId, getDetectedRequestsCountForTabId(tabId));
      dispatch(setCurrentTabId(tabId));
    }
  });

  browser.tabs.onRemoved.addListener(({ tabId }) => {
    dispatch(removeTabIdFromDetectedRequests(tabId));
  });
}

function handleUpdate() {
  browser.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
    if (reason === 'update' && previousVersion <= '1.6.1') {
      openInNewTab('https://docs.misakey.com/#/release/?id=version-200');
    }
  });
}

function handleRequest(engine) {
  const URLS_PATTERNS = ['<all_urls>'];

  browser.webRequest.onHeadersReceived.addListener(
    (details) => engine.onHeadersReceived(browser, details),
    { urls: URLS_PATTERNS, types: ['main_frame'] },
    ['blocking', 'responseHeaders'],
  );

  // Start listening to requests, and allow 'blocking' so that we can cancel
  // some of them (or redirect).
  browser.webRequest.onBeforeRequest.addListener((details) => {
    const request = Request.fromRawDetails({
      ...details,
      sourceUrl: details.initiator || details.originUrl,
      _originalRequestDetails: details,
    });
    const { blockingResponse, filter } = getBlockingResponse(engine, request);
    const hasToBeBlocked = Boolean(blockingResponse.cancel || blockingResponse.redirectUrl);

    const { tabId, url } = request;
    // Reset tab infos in case of reload or url changes
    if (request.isMainFrame()) {
      dispatch(setDetectedRequestsForTabId(tabId, []));
    }

    // The request has match a rule
    if (filter) {
      const { hostname, domainWithoutSuffix } = parse(url);

      const app = {
        mainDomain: hostname,
        mainPurpose: getPurpose(filter),
        blocked: hasToBeBlocked,
        name: domainWithoutSuffix,
        id: hostname,
      };

      dispatch(addToDetectedRequests(tabId, app));
    }

    return blockingResponse;
  },
  {
    urls: URLS_PATTERNS,
  },
  ['blocking']);
}

function handleContentScriptMessages(engine) {
  browser.runtime.onMessage.addListener(((msg, sender) => {
    // Listener for other scripts messages. The main messages come from content script
    switch (msg.action) {
      case 'getBlockerState': {
        const { pause } = store.getState().pause;
        return Promise.resolve(pause);
      }
      default:
        // Start listening to messages coming from the content-script. Whenever a new
        // frame is created (either a main document or iframe), it will be requesting
        // cosmetics to inject in the DOM. Send back styles and scripts to inject to
        // block/hide trackers and scripts.
        return engine.onRuntimeMessage(browser, msg, sender);
    }
  }));
}

function launchExtension() {
  try {
    handleUpdate();
    handleConfig();
    loadAdblocker()
      .then(((engine) => {
        handleTabs();
        handleRequest(engine);
        handleContentScriptMessages(engine);
      }))
      .catch((err) => {
        log(err);
        dispatch(showWarning('error'));
        toggleBadgeAndIconOnPaused(true);
      });
  } catch (err) {
    dispatch(showWarning('error'));
    log(err);
  }
}

launchExtension();
