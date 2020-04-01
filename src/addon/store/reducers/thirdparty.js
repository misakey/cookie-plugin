import createReducer from 'store/reducers/helpers/createReducer';
import isEmpty from 'lodash/isEmpty';
import {
  SET_WHITELISTED_DOMAINS,
  SET_DETECTED_REQUESTS_FOR_TAB_ID,
  REMOVE_TAB_ID_FROM_DETECTED_REQUESTS,
  ADD_TO_DETECTED_REQUESTS,
} from 'store/actions/thirdparty';

const DEFAULT_PURPOSE = 'other';

const initialState = {
  detectedRequests: [],
  whitelistedDomains: [],
};

function setWhitelistedDomains(state, { whitelistedDomains }) {
  return { ...state, whitelistedDomains };
}

function addToDetectedRequests(state, { tabId, newDetected }) {
  const alreadyDetectedsInTab = state.detectedRequests[tabId] || [];

  const { mainPurpose, mainDomain, blocked } = newDetected;

  const alreadyDetected = alreadyDetectedsInTab.find(
    (element) => element.mainDomain === mainDomain,
  );

  // Group scripts detected by mainDomain
  if (!isEmpty(alreadyDetected)) {
    // If the previous script detected has no known category but this one have one
    // we replace the category associated to the script
    if (mainPurpose !== DEFAULT_PURPOSE && alreadyDetected.mainPurpose === DEFAULT_PURPOSE) {
      alreadyDetected.mainPurpose = mainPurpose;
      alreadyDetected.blocked = alreadyDetected.blocked || blocked;
      return {
        ...state,
        detectedRequests: {
          ...state.detectedRequests,
          [tabId]: alreadyDetectedsInTab,
        },
      };
    }

    // The detected script doesn't bring any new information about the app
    if (mainPurpose === DEFAULT_PURPOSE || mainPurpose === alreadyDetected.mainPurpose) {
      if (alreadyDetected.blocked !== blocked) {
        alreadyDetected.blocked = blocked;
        return {
          ...state,
          detectedRequests: {
            ...state.detectedRequests,
            [tabId]: alreadyDetectedsInTab,
          },
        };
      }
      return state;
    }
  }
  const newDetectedsForTabId = [...state.detectedRequests[tabId] || [], newDetected];

  return {
    ...state,
    detectedRequests: {
      ...state.detectedRequests,
      [tabId]: newDetectedsForTabId,
    },
  };
}

function setDetectedRequestsForTabId(state, { tabId, detecteds }) {
  return {
    ...state,
    detectedRequests: {
      ...state.detectedRequests,
      [tabId]: detecteds,
    },
  };
}

export function removeTabIdFromDetectedRequests(state, tabId) {
  const newStateDetected = { ...state.detectedRequests };
  delete newStateDetected[tabId];
  return {
    ...state,
    detectedRequests: newStateDetected,
  };
}


export default createReducer(initialState, {
  [SET_DETECTED_REQUESTS_FOR_TAB_ID]: setDetectedRequestsForTabId,
  [SET_WHITELISTED_DOMAINS]: setWhitelistedDomains,
  [ADD_TO_DETECTED_REQUESTS]: addToDetectedRequests,
  [REMOVE_TAB_ID_FROM_DETECTED_REQUESTS]: removeTabIdFromDetectedRequests,
});
