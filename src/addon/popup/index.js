/* IMPORTS */
import React from 'react';
import ReactDOM from 'react-dom';
// store
import { createStore } from 'redux';
import { Provider as StoreProvider } from 'react-redux';
import reducers from 'popup/store/reducers';
// routing
import { BrowserRouter as Router } from 'react-router-dom';
// ui
import MuiThemeProvider from 'popup/components/smart/ThemeProvider';
import theme from '@misakey/ui/theme';
// components
import App from 'popup/components/App';
// helpers
import { isDesktopDevice } from 'helpers/devices';
import './index.css';

/* END OF IMPORTS */

const rootNode = document.getElementById('root');

if (isDesktopDevice()) {
  rootNode.setAttribute(
    'data-plugin-controlsize',
    true,
  );
}

// STORE
const store = createStore(reducers);

ReactDOM.render((
  <React.Suspense fallback={null}>
    <StoreProvider store={store}>
      <MuiThemeProvider theme={theme}>
        <Router>
          <App />
        </Router>
      </MuiThemeProvider>
    </StoreProvider>
  </React.Suspense>
), rootNode);
