import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showWarning } from 'store/actions/warning';
import { togglePauseState, setPauseState, setTimeoutFunction } from 'store/actions/pause';

import useTranslation from 'popup/hooks/useTranslation';

import makeStyles from '@material-ui/core/styles/makeStyles';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Pause from '@material-ui/icons/Pause';
import PlayArrow from '@material-ui/icons/PlayArrow';

// HOOKS
const useStyles = makeStyles(() => ({
  button: { minWidth: 'unset' },
}));

const useOptions = (t) => useMemo(() => [
  {
    label: t('minute', 30, { plural: true }),
    value: 30,
  },
  {
    label: t('hour', 1, { plural: true }),
    value: 60,
  },
  {
    label: t('hour', 24, { plural: true }),
    value: 1440,
  },
  {
    label: t('pauseIndeterminate'),
    value: null,
  },
], [t]);

const usePause = (dispatchOnPauseBlocking, dispatchShowWarning) => useCallback((time = null) => {
  const deadline = time ? Date.now() + (time * 60 * 1000) : null;
  dispatchOnPauseBlocking(deadline);
  dispatchShowWarning();
}, [dispatchOnPauseBlocking, dispatchShowWarning]);

const useHandleChoice = (onPause, setAnchorEl) => useCallback((value) => {
  onPause(value);
  setAnchorEl(null);
}, [onPause, setAnchorEl]);

// HELPERS
const getPlannedDate = (pausedTime) => {
  const date = new Date(pausedTime);
  return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
};

function PauseButton({ dispatchShowWarning, dispatchOnPauseBlocking, pause, time }) {
  const classes = useStyles();
  const t = useTranslation();

  const options = useOptions(t);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const onPause = usePause(dispatchOnPauseBlocking, dispatchShowWarning);

  const handleChoice = useHandleChoice(onPause, setAnchorEl);
  const onClose = useCallback(() => { setAnchorEl(null); }, []);
  const onClick = useCallback(
    (event) => (pause ? onPause() : setAnchorEl(event.currentTarget)), [onPause, pause],
  );

  return (
    <React.Fragment>
      <Tooltip title={pause
        ? `${time ? t('plannedResume', getPlannedDate(time)) : t('resumeDescription')}`
        : t('pauseDescription')}
      >
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          className={classes.button}
          aria-owns={anchorEl ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={onClick}
        >
          {pause ? <PlayArrow /> : <Pause />}
        </Button>
      </Tooltip>

      <Menu
        id="pause-menu"
        anchorEl={anchorEl}
        keepMounted
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        onClose={onClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} onClick={() => handleChoice(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

PauseButton.propTypes = {
  dispatchShowWarning: PropTypes.func.isRequired,
  dispatchOnPauseBlocking: PropTypes.func.isRequired,
  pause: PropTypes.bool,
  time: PropTypes.string,
};

PauseButton.defaultProps = {
  pause: false,
  time: null,
};

// CONNECT

const mapStateToProps = (state) => ({
  pause: state.pause.pause,
  time: state.pause.time,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchOnPauseBlocking: (time = null) => {
    dispatch(togglePauseState(time));

    if (time) {
      const timeoutFunction = setTimeout(() => {
        dispatch(setPauseState(false, null));
      }, time - Date.now());
      dispatch(setTimeoutFunction(timeoutFunction));
    }
  },
  dispatchShowWarning: () => dispatch(showWarning('refresh')),
});

export default connect(mapStateToProps, mapDispatchToProps)(PauseButton);
