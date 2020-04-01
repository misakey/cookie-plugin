import get from 'lodash/get';
import { updateActiveRequestsCounter } from 'helpers/browserActions';
import { getCurrentTab } from 'helpers/tabs';
import { ADD_TO_DETECTED_REQUESTS, SET_DETECTED_REQUESTS_FOR_TAB_ID } from 'store/actions/thirdparty';

export const counterMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if ([SET_DETECTED_REQUESTS_FOR_TAB_ID, ADD_TO_DETECTED_REQUESTS].includes(action.type)) {
    getCurrentTab().then(({ id }) => {
      if (action.tabId === id) {
        const newDetected = get(store.getState().thirdparty.detectedRequests, id);
        const blockedCounter = newDetected.filter(({ blocked }) => blocked === true).length;
        updateActiveRequestsCounter(action.tabId, blockedCounter);
      }
    });
  }

  return result;
};
