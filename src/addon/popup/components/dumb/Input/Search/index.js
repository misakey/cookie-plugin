import React, { useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'popup/hooks/useTranslation';

import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';

import omit from 'lodash/omit';
import isFunction from 'lodash/isFunction';

// CONSTANTS
const PROPS_INTERNAL = ['staticContext'];

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    color: 'inherit',
    fontSize: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(2),
    transition: theme.transitions.create('width'),
    width: '100%',
    textOverflow: 'ellipsis',
  },
  searchIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    width: '100%',
    backgroundColor: theme.palette.white,
  },
}));

// HELPERS
const getOnClick = (onIconClick) => (e) => {
  if (isFunction(onIconClick)) {
    onIconClick(e);
  }
};

// HOOKS
const useOnClick = (onIconClick) => useMemo(() => getOnClick(onIconClick), [onIconClick]);
const useHasClick = (onIconClick) => useMemo(() => isFunction(onIconClick), [onIconClick]);
// COMPONENTS
function InputSearch({
  Icon,
  onIconClick,
  children,
  dark,
  ...rest }, ref) {
  const classes = useStyles();
  const props = omit(rest, PROPS_INTERNAL);
  const t = useTranslation();

  const onClick = useOnClick(onIconClick);
  const hasClick = useHasClick(onIconClick);

  return (
    <div className={classes.container}>
      {hasClick ? (
        <div className={classes.searchIcon}>
          <IconButton onClick={onClick}>
            <Icon />
          </IconButton>
        </div>
      ) : (
        <div className={classes.searchIcon}>
          <Icon />
        </div>
      )}

      {/* autoFocus doesn't seem to spread to InputBase */}
      <InputBase
        inputRef={ref}
        placeholder={t('search')}
        classes={{ root: classes.inputRoot, input: classes.inputInput }}
        {...props}
      />
      {children}
    </div>
  );
}

const InputSearchWithRef = forwardRef(InputSearch);

InputSearch.propTypes = {
  t: PropTypes.func.isRequired,
  Icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.object]),
  children: PropTypes.node,
  inputClasses: PropTypes.object,
  dark: PropTypes.bool,
  onIconClick: PropTypes.func,
};

InputSearch.defaultProps = {
  Icon: SearchIcon,
  onIconClick: null,
  inputClasses: {},
  children: null,
  dark: false,
};

export default InputSearchWithRef;
