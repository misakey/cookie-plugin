
import createReducer from 'popup/store/reducers/helpers/createReducer';

import {
  SET_CURRENT_WEBSITE,
} from 'popup/store/actions/currentWebsite';

const initialState = {
  name: '',
  faviconUrl: null,
  hostname: null,
};

function setCurrentWebsite(state, { currentWebsite }) {
  return { ...state, ...currentWebsite };
}

export default createReducer(initialState, {
  [SET_CURRENT_WEBSITE]: setCurrentWebsite,
});
