
import createReducer from 'store/reducers/helpers/createReducer';
import isNil from 'lodash/isNil';

import {
  SET_TIMEOUT_FUNCTION,
  SET_PAUSE_STATE,
  TOGGLE_PAUSE_STATE,
} from 'store/actions/pause';

const initialState = {
  paused: false,
  time: null,
  timeout: null,
};

function setPauseState(state, { pause, time }) {
  return { ...state, pause, time };
}
function togglePauseState(state, { time }) {
  const pause = !isNil(time) ? true : !state.pause;
  return {
    ...state,
    pause,
    time: !state.pause ? null : time,
  };
}

function setTimeoutFunction(state, { timeout }) {
  // handle clearing of a previous timeout to reset a new timeout and avoid collision
  if (!isNil(state.timeout)) { clearTimeout(state.timeout); }

  return {
    ...state,
    timeout,
  };
}

export default createReducer(initialState, {
  [SET_PAUSE_STATE]: setPauseState,
  [SET_TIMEOUT_FUNCTION]: setTimeoutFunction,
  [TOGGLE_PAUSE_STATE]: togglePauseState,
});
