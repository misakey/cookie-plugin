import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import isNil from 'lodash/isNil';

function Screen({ appBarContent, children }) {
  return (
    <Box>
      {!isNil(appBarContent) && (
        <AppBar position="static" color="inherit" elevation={0}>
          <Toolbar>
            {appBarContent}
          </Toolbar>
        </AppBar>
      )}
      <Box>
        {children}
      </Box>
    </Box>
  );
}

Screen.propTypes = {
  appBarContent: PropTypes.node,
  children: PropTypes.node,
};

Screen.defaultProps = {
  appBarContent: null,
  children: null,
};

export default Screen;
