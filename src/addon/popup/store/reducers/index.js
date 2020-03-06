import { combineReducers } from 'redux';

import thirdparty from 'popup/store/reducers/thirdparty';
import warning from 'popup/store/reducers/warning';
import currentWebsite from 'popup/store/reducers/currentWebsite';

const appReducer = combineReducers({
  thirdparty,
  currentWebsite,
  warning,
});

export default appReducer;
