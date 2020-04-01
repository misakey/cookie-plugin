import { TOGGLE_PAUSE_STATE } from 'store/actions/pause';
import { setItem } from 'helpers/storage';
import { toggleBadgeAndIconOnPaused } from 'helpers/browserActions';

export const pauseMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const newPauseValue = store.getState().pause.pause;
  if (action.type === TOGGLE_PAUSE_STATE) {
    toggleBadgeAndIconOnPaused(newPauseValue);
    if (action.persist) {
      setItem('pausedBlocking', newPauseValue);
    }
  }

  return result;
};
