
import createReducer from 'popup/store/reducers/helpers/createReducer';
import {
  REFRESH_WARNING_SHOW,
  REFRESH_WARNING_HIDE,
} from 'popup/store/actions/warning';

const initialState = {
  displayRefreshWarning: false,
};

function showRefreshWarning(state) {
  return { ...state, displayRefreshWarning: true };
}
function hideRefreshWarning(state) {
  return { ...state, displayRefreshWarning: false };
}

export default createReducer(initialState, {
  [REFRESH_WARNING_SHOW]: showRefreshWarning,
  [REFRESH_WARNING_HIDE]: hideRefreshWarning,
});
