import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Switch as MaterialUiSwitch } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&.readonly $switchBase': {
      cursor: 'default',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  disabled: {
    // color: theme.palette.grey[500],
    '&$checked + $track': {
      opacity: 0.19,
      backgroundColor: theme.palette.black,
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    width: '90%',
    height: '90%',
    backgroundColor: theme.palette.common.white,
  },
  checked: {
    transform: 'translateX(60%)',
    color: theme.palette.common.white,
  },
}));

function Switch({ checked, value, label, onChange, ...rest }) {
  const classes = useStyles();

  return (
    <MaterialUiSwitch
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
        disabled: classes.disabled,
      }}
      checked={checked}
      onChange={onChange}
      value={value}
      inputProps={{ 'aria-label': label }}
      {...rest}
    />
  );
}

Switch.propTypes = {
  value: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
};

Switch.defaultProps = {
  value: '',
  checked: true,
  onChange: PropTypes.func,
  label: 'secondarey switch',
};

export default Switch;
