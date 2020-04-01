
import createReducer from 'store/reducers/helpers/createReducer';
import {
  SHOW_WARNING,
  HIDE_WARNING,
} from 'store/actions/warning';

const initialState = {
  displayWarning: {
    refresh: false,
    error: false,
  },
};

function showWarning(state, { warningType }) {
  return {
    ...state,
    displayWarning: {
      ...state.displayWarning,
      [warningType]: true,
    },
  };
}
function hideWarning(state, { warningType }) {
  return {
    ...state,
    displayWarning: {
      ...state.displayWarning,
      [warningType]: false,
    },
  };
}

export default createReducer(initialState, {
  [SHOW_WARNING]: showWarning,
  [HIDE_WARNING]: hideWarning,
});
