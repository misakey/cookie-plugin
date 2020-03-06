import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { setWhitelist, setApps } from 'popup/store/actions/thirdparty';
import { refreshWarningShow } from 'popup/store/actions/warning';
import ThirdPartySchema from 'popup/store/schemas/Trackers';

import ElevationScroll from 'popup/components/dumb/ElevationScroll';
import ThirdPartySearchBar from 'popup/components/smart/SearchBar';
import TrackerList from 'popup/components/screens/Setup/List';
import Switch from 'popup/components/dumb/Switch';
import Screen from 'popup/components/dumb/Screen';

import { sendMessage, UPDATE_WHITELIST, GET_APPS, GET_WHITELIST } from 'helpers/messages';
import useTranslation from 'popup/hooks/useTranslation';

const PURPOSES_FILTER_HEIGHT = 38;
const APP_BAR_HEIGHT = 56;

// STYLES
const useStyles = makeStyles(() => ({
  labelSmall: {
    padding: '5px',
  },
  chip: { margin: '7px 4px' },
  trackerList: {
    height: `calc(100vh - ${APP_BAR_HEIGHT}px - ${PURPOSES_FILTER_HEIGHT}px)`,
    overflow: 'auto',
  },
}));

const getSearchParams = (search) => {
  const params = new URLSearchParams(search);
  return {
    mainPurpose: params.get('mainPurpose'),
    search: params.get('search'),
  };
};

const useUpdateWhitelist = (
  dispatchWhitelist,
  dispatchShowWarning,
  whitelistedDomains,
) => useCallback((action, domain) => {
  const newWhitelist = action === 'add' ? [...whitelistedDomains, domain] : whitelistedDomains.filter((val) => val !== domain);
  sendMessage(UPDATE_WHITELIST, { whitelistedDomains: newWhitelist }).then((response) => {
    dispatchWhitelist(response);
    dispatchShowWarning();
  });
}, [whitelistedDomains, dispatchWhitelist, dispatchShowWarning]);

const useSetParams = (location, history) => useCallback((search, mainPurpose) => {
  const nextSearch = new URLSearchParams('');
  if (!isEmpty(search)) {
    nextSearch.set('search', search);
  }

  if (!isEmpty(mainPurpose)) {
    nextSearch.set('mainPurpose', mainPurpose);
  }

  const query = nextSearch.toString();
  const nextLocation = isEmpty(query) ? location.pathname : `${location.pathname}?${query}`;
  history.replace(nextLocation);
}, [location, history]);

function ThirdPartySetup({
  dispatchApps,
  dispatchWhitelist,
  dispatchShowWarning,
  websiteName,
  apps: { whitelisted, blocked },
  location,
  history,
  whitelistedDomains,
}) {
  const classes = useStyles();
  const t = useTranslation();

  const [isFetching, setIsFetching] = React.useState(false);
  const [trackerListRef, setTrackerListRef] = React.useState(undefined);

  const { search, mainPurpose } = getSearchParams(location.search);
  const setParams = useSetParams(location, history);

  const updateWhitelist = useUpdateWhitelist(
    dispatchWhitelist,
    dispatchShowWarning,
    whitelistedDomains,
  );

  const listSecondaryAction = useCallback((application) => {
    const isWhitelisted = whitelistedDomains.includes(application.mainDomain);
    const onChange = () => updateWhitelist(isWhitelisted ? 'remove' : 'add', application.mainDomain);
    return <Switch checked={isWhitelisted} onChange={onChange} value={application.id} />;
  }, [updateWhitelist, whitelistedDomains]);

  const searchParams = useMemo(() => ({ search, mainPurpose }), [search, mainPurpose]);
  const endOfListText = useMemo(
    () => (mainPurpose
      ? t('setup_thirdParty_endOfList_mainPurpose', [websiteName, t(`thirdParty_purposes_${mainPurpose}`)])
      : t('setup_thirdParty_endOfList', [websiteName])),
    [mainPurpose, t, websiteName],
  );

  const getWhitelist = useCallback(() => {
    sendMessage(GET_WHITELIST).then((response) => { dispatchWhitelist(response); });
  }, [dispatchWhitelist]);

  const getApps = useCallback(() => {
    sendMessage(GET_APPS, searchParams).then((response) => { dispatchApps(response); });
  }, [dispatchApps, searchParams]);

  const togglePurpose = useCallback((purpose) => {
    if (purpose === 'all' || mainPurpose === purpose) {
      return setParams(search, null);
    }
    return setParams(search, purpose);
  }, [mainPurpose, search, setParams]);

  const isChipActive = useCallback(
    (purpose) => ((mainPurpose === purpose) || (isNil(mainPurpose) && purpose === 'all')),
    [mainPurpose],
  );

  useEffect(getWhitelist, []);
  useEffect(getApps, [getApps]);

  return (
    <Screen appBarContent={(
      <ThirdPartySearchBar
        onIconClick={history.goBack}
        location={location}
        onSearch={(s) => { setParams(s, mainPurpose); }}
        onFiltersChange={(purpose) => { setParams(search, purpose); }}
        onFetching={(value) => setIsFetching(value)}
        key="thirdPartySearchBar"
      />
    )}
    >
      <ElevationScroll target={trackerListRef}>
        <Paper>
          <Box display="flex" justifyContent="center" flexWrap="wrap">
            {['all', 'advertising', 'analytics', 'social_interaction', 'personalization', 'other'].map((purpose) => (
              <Chip
                key={purpose}
                classes={{ labelSmall: classes.labelSmall, root: classes.chip }}
                label={t(`thirdParty_purposes_${purpose}`)}
                color={isChipActive(purpose) ? 'secondary' : 'primary'}
                onClick={() => togglePurpose(purpose)}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Paper>
      </ElevationScroll>

      <Box className={classes.trackerList} ref={(ref) => setTrackerListRef(ref)}>
        {!isFetching && (
          <React.Fragment>
            {whitelisted.length > 0 && (
              <TrackerList
                title={t('setup_thirdParty_categories_whitelisted')}
                entities={whitelisted}
                secondaryAction={listSecondaryAction}
              />
            )}

            {blocked.length > 0 && (
              <TrackerList
                title={t('setup_thirdParty_categories_blocked')}
                entities={blocked}
                secondaryAction={listSecondaryAction}
              />
            )}

            <Box
              p={1}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              textAlign="center"
              alignItems="center"
            >
              <Typography variant="body2" color="textSecondary">
                {endOfListText}
              </Typography>
            </Box>
          </React.Fragment>
        )}

      </Box>
    </Screen>
  );
}

ThirdPartySetup.propTypes = {
  dispatchApps: PropTypes.func.isRequired,
  dispatchWhitelist: PropTypes.func.isRequired,
  dispatchShowWarning: PropTypes.func.isRequired,
  apps: PropTypes.shape({
    blocked: PropTypes.arrayOf(PropTypes.shape(ThirdPartySchema.propTypes)),
    whitelisted: PropTypes.arrayOf(PropTypes.shape(ThirdPartySchema.propTypes)),
  }),
  history: PropTypes.object.isRequired,
  location: PropTypes.shape({ search: PropTypes.string, pathname: PropTypes.string }).isRequired,
  whitelistedDomains: PropTypes.arrayOf(PropTypes.string),
  websiteName: PropTypes.string.isRequired,
};

ThirdPartySetup.defaultProps = {
  apps: [],
  whitelistedDomains: [],
};

// CONNECT
const mapStateToProps = (state) => ({
  apps: state.thirdparty.apps,
  whitelistedDomains: state.thirdparty.whitelistedDomains,
  websiteName: state.currentWebsite.name,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchApps: (data) => dispatch(setApps(data)),
  dispatchWhitelist: (data) => dispatch(setWhitelist(data)),
  dispatchShowWarning: () => dispatch(refreshWarningShow()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThirdPartySetup);
