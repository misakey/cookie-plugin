import React from 'react';
import routes from 'popup/routes';
import { Route, Switch, Redirect } from 'react-router-dom';

import Summary from 'popup/components/screens/Summary';
import ThirdPartySetup from 'popup/components/screens/Setup';
import DefaultScreen from 'popup/components/screens/Default';
import RefreshWarning from 'popup/components/smart/Warning/Refresh';
import ErrorWarning from 'popup/components/smart/Warning/Error';

const App = () => (
  <React.Fragment>
    <ErrorWarning />
    <RefreshWarning />
    <Switch>
      <Route path={routes.summary} component={Summary} />
      <Route
        exact
        path={routes.setup}
        render={
        (routerProps) => <ThirdPartySetup {...routerProps} />
        }
      />
      <Redirect exact path={routes._} to={routes.summary} />
      <Route component={DefaultScreen} />
    </Switch>
  </React.Fragment>
);

export default App;
