
import createReducer from 'store/reducers/helpers/createReducer';

import {
  ADD_TO_WEBSITES_INFO,
  SET_CURRENT_TAB_ID,
  DELETE_FROM_WEBSITES_INFO,
} from 'store/actions/websites';

const initialState = {
  infos: {},
  currentTabId: null,
};

function addToWebsitesInfo(state, { tabId, websiteInfos }) {
  return {
    ...state,
    infos: {
      ...state.infos,
      [tabId]: websiteInfos,
    },
  };
}

function deleteFromWebsitesInfo(state, { tabId }) {
  const newStateInfos = { ...state.infos };
  delete newStateInfos[tabId];
  return {
    ...state,
    infos: newStateInfos,
  };
}

function setCurrentTabId(state, { tabId }) {
  return { ...state, currentTabId: tabId };
}

export default createReducer(initialState, {
  [ADD_TO_WEBSITES_INFO]: addToWebsitesInfo,
  [SET_CURRENT_TAB_ID]: setCurrentTabId,
  [DELETE_FROM_WEBSITES_INFO]: deleteFromWebsitesInfo,
});
