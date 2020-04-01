// Actions with Symbol doesn't works from popup
export const ADD_TO_WEBSITES_INFO = 'ADD_TO_WEBSITES_INFO';
export const SET_CURRENT_TAB_ID = 'SET_CURRENT_TAB_ID';
export const DELETE_FROM_WEBSITES_INFO = 'DELETE_FROM_WEBSITES_INFO';

export function addToWebsitesInfo(tabId, websiteInfos) {
  return {
    type: ADD_TO_WEBSITES_INFO,
    tabId,
    websiteInfos,
  };
}

export function deleteInfoForTab(tabId) {
  return {
    type: DELETE_FROM_WEBSITES_INFO,
    tabId,
  };
}

export function setCurrentTabId(tabId) {
  return {
    type: SET_CURRENT_TAB_ID,
    tabId,
  };
}
