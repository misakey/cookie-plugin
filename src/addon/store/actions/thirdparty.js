import { setItem } from 'helpers/storage';

export const SET_WHITELISTED_DOMAINS = 'SET_WHITELISTED_DOMAINS';
export const ADD_TO_DETECTED_REQUESTS = 'ADD_TO_DETECTED_REQUESTS';
export const SET_DETECTED_REQUESTS_FOR_TAB_ID = 'SET_DETECTED_REQUESTS_FOR_TAB_ID';
export const REMOVE_TAB_ID_FROM_DETECTED_REQUESTS = 'REMOVE_TAB_ID_FROM_DETECTED_REQUESTS';

export function addToDetectedRequests(tabId, newDetected) {
  return {
    type: ADD_TO_DETECTED_REQUESTS,
    tabId,
    newDetected,
  };
}

export function setDetectedRequestsForTabId(tabId, detecteds) {
  return {
    type: SET_DETECTED_REQUESTS_FOR_TAB_ID,
    tabId,
    detecteds,
  };
}

export function removeTabIdFromDetectedRequests(tabId) {
  return {
    type: REMOVE_TAB_ID_FROM_DETECTED_REQUESTS,
    tabId,
  };
}

export function setWhitelist(whitelistedDomains, persist) {
  if (persist) {
    setItem('whitelist', { apps: whitelistedDomains });
  }
  return {
    type: SET_WHITELISTED_DOMAINS,
    whitelistedDomains,
  };
}
