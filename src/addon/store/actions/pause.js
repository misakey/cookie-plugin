export const SET_PAUSE_STATE = 'SET_PAUSE_STATE';
export const TOGGLE_PAUSE_STATE = 'TOGGLE_PAUSE_STATE';
export const SET_TIMEOUT_FUNCTION = 'SET_TIMEOUT_FUNCTION';

export const setPauseState = (pause, time, persist) => ({
  type: SET_PAUSE_STATE,
  pause,
  time,
  persist,
});

export const togglePauseState = (time) => ({
  type: TOGGLE_PAUSE_STATE,
  time,
});

export const setTimeoutFunction = (timeout) => ({
  type: SET_TIMEOUT_FUNCTION,
  timeout,
});
