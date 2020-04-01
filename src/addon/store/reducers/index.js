import { combineReducers } from 'redux';

import thirdparty from 'store/reducers/thirdparty';
import warning from 'store/reducers/warning';
import websites from 'store/reducers/websites';
import pause from 'store/reducers/pause';

const appReducer = combineReducers({
  thirdparty,
  websites,
  warning,
  pause,
});

export default appReducer;
