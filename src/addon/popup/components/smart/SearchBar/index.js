import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';

import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import get from 'lodash/get';

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
  currentWebsite,
  onIconClick,
  onSearch,
  value,
}) {
  const inputRef = useRef();

  const classes = useStyles();

  const isSearchActive = useIsSearchActive(value);
  const hasSearch = useHasSearch(value);

  const onSearchChange = useOnSearchChange(onSearch);
  const onReset = useOnReset(onSearch, inputRef);
  const onActive = useOnActive(inputRef);

  return (
    <InputSearch
      ref={inputRef}
      autoFocus={isSearchActive}
      value={value}
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
  currentWebsite: PropTypes.shape({
    name: PropTypes.string,
    faviconUrl: PropTypes.string,
  }),
  value: PropTypes.string,
  onIconClick: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

ThirdPartySearchBar.defaultProps = {
  currentWebsite: {
    name: '',
    faviconUrl: null,
  },
  value: '',
};

const mapStateToProps = (state) => ({
  currentWebsite: get(state.websites.infos, state.websites.currentTabId, {
    faviconUrl: null,
    name: '',
  }),
});


export default connect(mapStateToProps)(ThirdPartySearchBar);
