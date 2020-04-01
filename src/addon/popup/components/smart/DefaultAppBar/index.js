import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import PauseButton from 'popup/components/smart/Button/Pause';
import WebsiteAvatar from 'popup/components/dumb/Avatar/Website';


const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    alignSelf: 'center',
  },
}));


function DefaultAppBar({ currentWebsite }) {
  const classes = useStyles();
  const { name, faviconUrl } = useMemo(() => currentWebsite, [currentWebsite]);

  return (
    <Box display="flex" flexGrow={1}>
      <WebsiteAvatar name={name} src={faviconUrl} />
      <Typography variant="h6" className={classes.title}>{name}</Typography>
      <PauseButton />
    </Box>
  );
}

DefaultAppBar.propTypes = {
  currentWebsite: PropTypes.shape({
    faviconUrl: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

// CONNECT
const mapStateToProps = (state) => ({
  currentWebsite: get(state.websites.infos, state.websites.currentTabId, {
    faviconUrl: null,
    name: '',
  }),
});

export default connect(mapStateToProps)(DefaultAppBar);
