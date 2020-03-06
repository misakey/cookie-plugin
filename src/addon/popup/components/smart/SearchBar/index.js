import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';

import {
  setApps,
} from 'popup/store/actions/thirdparty';

import isNil from 'lodash/isNil';
import isString from 'lodash/isString';

import InputSearch from 'popup/components/dumb/Input/Search';
import WebsiteAvatar from 'popup/components/dumb/Avatar/Website';

// HELPERS
const getOnSearchChange = (onSearch) => ({ target: { value } }) => {
  if (isString(value)) {
    onSearch(value);
  }
};
const getOnReset = (onSearch, inputRef) => ({ noFocus }) => {
  onSearch('');
  if (!isNil(inputRef.current) && noFocus !== true) {
    inputRef.current.focus();
  }
};

const getSearchParams = (search) => {
  const params = new URLSearchParams(search);
  return { search: params.get('search') };
};

const getIsSearchActive = (search) => !isNil(search);
const getHasSearch = (search) => getIsSearchActive(search) && search.length > 0;

// HOOKS
const useOnSearchChange = (setSearch) => useMemo(() => getOnSearchChange(setSearch), [setSearch]);
const useOnReset = (setSearch, inputRef) => useMemo(
  () => getOnReset(setSearch, inputRef), [setSearch, inputRef],
);

const useStyles = makeStyles(() => ({
  clearButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const useOnActive = (inputRef) => useMemo(() => () => {
  if (!isNil(inputRef.current)) {
    inputRef.current.focus();
  }
}, [inputRef]);

const useIsSearchActive = (search) => useMemo(() => getIsSearchActive(search), [search]);
const useHasSearch = (search) => useMemo(() => getHasSearch(search), [search]);

// COMPONENTS
function ThirdPartySearchBar({
  dispatchApps,
  location,
  currentWebsite,
  onIconClick,
  onFetching,
  onSearch,
  ...rest
}) {
  const inputRef = useRef();

  const classes = useStyles();
  const queryParams = getSearchParams(location.search);

  const search = queryParams.search || '';

  const isSearchActive = useIsSearchActive(search);
  const hasSearch = useHasSearch(search);

  const onSearchChange = useOnSearchChange(onSearch);
  const onReset = useOnReset(onSearch, inputRef);
  const onActive = useOnActive(inputRef);

  return (
    <InputSearch
      ref={inputRef}
      {...rest}
      autoFocus={isSearchActive}
      value={search}
      onChange={onSearchChange}
      onFocus={onActive}
      Icon={ArrowBackIcon}
      onIconClick={onIconClick}
    >
      {hasSearch && (
        <IconButton
          className={classes.clearButton}
          aria-label="Clear"
          type="reset"
          onClick={onReset}
        >
          <CancelIcon />
        </IconButton>
      )}
      {currentWebsite && (
        <WebsiteAvatar
          src={currentWebsite.faviconUrl}
          name={currentWebsite.name}
        />
      )}
    </InputSearch>
  );
}

ThirdPartySearchBar.propTypes = {
  dispatchApps: PropTypes.func.isRequired,
  currentWebsite: PropTypes.shape({
    name: PropTypes.string,
    faviconUrl: PropTypes.string,
  }),
  location: PropTypes.shape({ pathname: PropTypes.string, search: PropTypes.string }).isRequired,
  onIconClick: PropTypes.func.isRequired,
  onFetching: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

ThirdPartySearchBar.defaultProps = {
  currentWebsite: {
    name: '',
    faviconUrl: null,
  },
};

const mapStateToProps = (state) => ({
  currentWebsite: state.currentWebsite,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchApps: (data) => {
    dispatch(setApps(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ThirdPartySearchBar);
