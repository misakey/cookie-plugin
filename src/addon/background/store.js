import { wrapStore } from 'webext-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import isNil from 'lodash/isNil';
import get from 'lodash/get';
import reducers from 'store/reducers';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { setPauseState } from 'store/actions/pause';
import { getItem } from 'helpers/storage';
import { setWhitelist } from 'store/actions/thirdparty';
import { counterMiddleware } from 'store/middlewares/thirdparty';
import { pauseMiddleware } from 'store/middlewares/pause';

// config store
const storeMiddleWares = [thunk, counterMiddleware, pauseMiddleware];
if (process.env.NODE_ENV === 'development') { storeMiddleWares.push(createLogger()); }

const store = createStore(reducers, compose(applyMiddleware(...storeMiddleWares)));

wrapStore(store);

// HELPERS
export const loadStorage = async () => {
  const { pausedBlocking } = await getItem('pausedBlocking');
  const paused = !isNil(pausedBlocking) ? pausedBlocking : false;
  store.dispatch(setPauseState(paused, null, false /* persist */));

  const { whitelist } = await getItem('whitelist');
  const whitelistedDomains = isNil(whitelist) ? [] : whitelist.apps;
  store.dispatch(setWhitelist(whitelistedDomains, false /* persist */));
};

export const isRequestWhitelisted = (targetDomain) => {
  const state = store.getState();
  const isPaused = state.pause.pause;
  const whitelisted = state.thirdparty.whitelistedDomains;
  return isPaused === true || whitelisted.includes(targetDomain);
};

export const getDetectedRequestsCountForTabId = (tabId) => get(
  store.getState().thirdparty.detectedRequests,
  tabId,
  [],
).filter(({ blocked }) => blocked === true).length;

export const dispatch = (action) => store.dispatch(action);
export const state = () => store.getState();

export default store;
