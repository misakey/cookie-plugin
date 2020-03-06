import React, { useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { refreshWarningShow } from 'popup/store/actions/warning';
import { sendMessage, GET_BLOCKER_STATE, TOGGLE_BLOCKED_STATE } from 'helpers/messages';

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

const useAssignCallback = (
  setPaused,
  setPausedTime,
) => useCallback((response) => {
  setPaused(response.paused);
  setPausedTime(response.pausedTime);
}, [setPaused, setPausedTime]);

const usePause = (assignCallback, dispatchShowWarning) => useCallback((time = null) => {
  const deadline = time ? Date.now() + (time * 60 * 1000) : null;
  return sendMessage(TOGGLE_BLOCKED_STATE, { time: deadline }).then((response) => {
    assignCallback(response);
    dispatchShowWarning();
  });
}, [assignCallback, dispatchShowWarning]);

const useHandleChoice = (onPause, setAnchorEl) => useCallback((value) => {
  onPause(value);
  setAnchorEl(null);
}, [onPause, setAnchorEl]);

// HELPERS
const getPlannedDate = (pausedTime) => {
  const date = new Date(pausedTime);
  return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
};

function PauseButton({ dispatchShowWarning }) {
  const classes = useStyles();
  const t = useTranslation();

  const options = useOptions(t);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [paused, setPaused] = React.useState(null);
  const [pausedTime, setPausedTime] = React.useState(null);

  const assignCallback = useAssignCallback(setPaused, setPausedTime);
  const onPause = usePause(assignCallback, dispatchShowWarning);

  const handleChoice = useHandleChoice(onPause, setAnchorEl);
  const onClose = useCallback(() => { setAnchorEl(null); }, []);
  const onClick = useCallback(
    (event) => (paused ? onPause() : setAnchorEl(event.currentTarget)), [onPause, paused],
  );

  useEffect(
    () => { sendMessage(GET_BLOCKER_STATE).then(assignCallback); },
    [assignCallback],
  );

  return (
    <React.Fragment>
      <Tooltip title={paused
        ? `${pausedTime ? t('plannedResume', getPlannedDate(pausedTime)) : t('resumeDescription')}`
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
          {paused ? <PlayArrow /> : <Pause />}
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
};

// CONNECT
const mapDispatchToProps = (dispatch) => ({
  dispatchShowWarning: () => dispatch(refreshWarningShow()),
});

export default connect(null, mapDispatchToProps)(PauseButton);
