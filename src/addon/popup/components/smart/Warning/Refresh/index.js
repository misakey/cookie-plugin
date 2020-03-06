// eslint-disable-next-line no-redeclare
/* global browser */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import useTranslation from 'popup/hooks/useTranslation';

import { refreshWarningHide } from 'popup/store/actions/warning';

import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

// HOOKS
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(1),
  },
  padding: {
    padding: theme.spacing(1),
  },
}));

const useRefreshTab = (dispatchHideWarning) => useCallback(() => {
  dispatchHideWarning();
  return browser.tabs.reload({ bypassCache: true });
}, [dispatchHideWarning]);

// COMPONENTS
const WarningDrawer = ({ displayWarning, dispatchHideWarning }) => {
  const classes = useStyles();
  const refreshTab = useRefreshTab(dispatchHideWarning);
  const t = useTranslation();

  return (
    <Drawer
      variant="persistent"
      anchor="bottom"
      classes={{ paper: classes.root }}
      open={displayWarning}
    >
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <IconButton className={classes.padding} size="small" onClick={dispatchHideWarning}>
          <CloseIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="caption" style={{ width: '70%' }}>
          {t('refreshWarning_text')}
        </Typography>
        <Tooltip title={t('refreshWarning_tooltip')} placement="bottom">
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={refreshTab}
          >
            {t('refreshWarning_button')}
          </Button>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

WarningDrawer.propTypes = {
  displayWarning: PropTypes.bool.isRequired,
  dispatchHideWarning: PropTypes.func.isRequired,
};

// CONNECT
const mapStateToProps = (state) => ({
  displayWarning: state.warning.displayRefreshWarning,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchHideWarning: () => dispatch(refreshWarningHide()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WarningDrawer);
