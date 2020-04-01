import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import useTranslation from 'popup/hooks/useTranslation';

import { hideWarning } from 'store/actions/warning';

import isFunction from 'lodash/isFunction';
import get from 'lodash/get';

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

const useRefreshExtension = (dispatchHideWarning, action) => useCallback(() => {
  dispatchHideWarning();
  if (isFunction(action)) { action(); }
}, [action, dispatchHideWarning]);

// COMPONENTS
const WarningDrawer = ({ displayWarning, dispatchHideWarning, type, action }) => {
  const classes = useStyles();
  const onClick = useRefreshExtension(dispatchHideWarning, action);
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
          {t(`warning_${type}_text`)}
        </Typography>
        <Tooltip title={t(`warning_${type}_tooltip`)} placement="bottom">
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={onClick}
          >
            {t(`warning_${type}_button`)}
          </Button>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

WarningDrawer.propTypes = {
  type: PropTypes.string.isRequired,
  action: PropTypes.func,
  displayWarning: PropTypes.bool.isRequired,
  dispatchHideWarning: PropTypes.func.isRequired,
};

WarningDrawer.defaultProps = {
  action: null,
};

// CONNECT
const mapStateToProps = (state, ownProps) => ({
  displayWarning: get(state.warning.displayWarning, ownProps.type, false),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchHideWarning: () => dispatch(hideWarning(ownProps.type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WarningDrawer);
