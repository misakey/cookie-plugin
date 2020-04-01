import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import isString from 'lodash/isString';

import { setWhitelist } from 'store/actions/thirdparty';
import { showWarning } from 'store/actions/warning';
import RequestsSchema from 'store/schemas/Requests';

import ElevationScroll from 'popup/components/dumb/ElevationScroll';
import ThirdPartySearchBar from 'popup/components/smart/SearchBar';
import RequestList from 'popup/components/screens/Setup/List';
import Switch from 'popup/components/dumb/Switch';
import Screen from 'popup/components/dumb/Screen';

import useTranslation from 'popup/hooks/useTranslation';

const PURPOSES_FILTER_HEIGHT = 38;
const APP_BAR_HEIGHT = 56;

// STYLES
const useStyles = makeStyles(() => ({
  labelSmall: {
    padding: '5px',
  },
  chip: { margin: '7px 4px' },
  requestList: {
    height: `calc(100vh - ${APP_BAR_HEIGHT}px - ${PURPOSES_FILTER_HEIGHT}px)`,
    overflow: 'auto',
  },
}));

const getSearchParams = (search) => {
  const params = new URLSearchParams(search);
  return { mainPurpose: params.get('mainPurpose') };
};

const useUpdateWhitelist = (
  dispatchWhitelist,
  dispatchShowWarning,
  whitelistedDomains,
) => useCallback((action, domain) => {
  const newWhitelist = action === 'add' ? [...whitelistedDomains, domain] : whitelistedDomains.filter((val) => val !== domain);
  dispatchWhitelist(newWhitelist);
  dispatchShowWarning();
}, [whitelistedDomains, dispatchWhitelist, dispatchShowWarning]);

const useSetParams = (location, history) => useCallback((mainPurpose) => {
  const nextSearch = new URLSearchParams('');
  if (!isEmpty(mainPurpose)) {
    nextSearch.set('mainPurpose', mainPurpose);
  }

  const query = nextSearch.toString();
  const nextLocation = isEmpty(query) ? location.pathname : `${location.pathname}?${query}`;
  history.replace(nextLocation);
}, [location, history]);

function ThirdPartySetup({
  dispatchWhitelist,
  dispatchShowWarning,
  websiteName,
  detectedRequests,
  location,
  history,
  whitelistedDomains,
}) {
  const classes = useStyles();
  const t = useTranslation();

  const [requestListRef, setRequestListRef] = React.useState(undefined);
  const [search, setSearch] = React.useState('');

  const { mainPurpose } = getSearchParams(location.search);
  const setParams = useSetParams(location, history);

  const filteredRequests = useMemo(() => {
    let result = [...detectedRequests];

    if (mainPurpose) {
      result = result.filter((app) => (app.mainPurpose === mainPurpose));
    }

    if (isString(search) && !isEmpty(search)) {
      result = result.filter(
        (app) => (app.mainDomain.toLowerCase().includes(search.toLowerCase())),
      );
    }

    return result;
  }, [detectedRequests, mainPurpose, search]);

  const { whitelisted = [], blocked = [] } = useMemo(
    () => groupBy(filteredRequests, (app) => (app.blocked ? 'blocked' : 'whitelisted')),
    [filteredRequests],
  );

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

  const endOfListText = useMemo(
    () => (mainPurpose
      ? t('setup_thirdParty_endOfList_mainPurpose', [websiteName, t(`thirdParty_purposes_${mainPurpose}`)])
      : t('setup_thirdParty_endOfList', [websiteName])),
    [mainPurpose, t, websiteName],
  );

  const togglePurpose = useCallback((purpose) => {
    if (purpose === 'all' || mainPurpose === purpose) {
      return setParams(null);
    }
    return setParams(purpose);
  }, [mainPurpose, setParams]);

  const isChipActive = useCallback(
    (purpose) => ((mainPurpose === purpose) || (isNil(mainPurpose) && purpose === 'all')),
    [mainPurpose],
  );

  return (
    <Screen appBarContent={(
      <ThirdPartySearchBar
        onIconClick={history.goBack}
        onSearch={setSearch}
        value={search}
        key="thirdPartySearchBar"
      />
    )}
    >
      <ElevationScroll target={requestListRef}>
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

      <Box className={classes.requestList} ref={(ref) => setRequestListRef(ref)}>
        <React.Fragment>
          {whitelisted.length > 0 && (
            <RequestList
              title={t('setup_thirdParty_categories_whitelisted')}
              entities={whitelisted}
              secondaryAction={listSecondaryAction}
            />
          )}

          {blocked.length > 0 && (
            <RequestList
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
      </Box>
    </Screen>
  );
}

ThirdPartySetup.propTypes = {
  dispatchWhitelist: PropTypes.func.isRequired,
  dispatchShowWarning: PropTypes.func.isRequired,
  detectedRequests: PropTypes.arrayOf(PropTypes.shape(RequestsSchema.propTypes)),
  history: PropTypes.object.isRequired,
  location: PropTypes.shape({ search: PropTypes.string, pathname: PropTypes.string }).isRequired,
  whitelistedDomains: PropTypes.arrayOf(PropTypes.string),
  websiteName: PropTypes.string.isRequired,
};

ThirdPartySetup.defaultProps = {
  detectedRequests: [],
  whitelistedDomains: [],
};

// CONNECT
const mapStateToProps = (state) => ({
  websiteName: get(state.websites.infos, state.websites.currentTabId, { name: '' }).name,
  detectedRequests: get(state.thirdparty.detectedRequests, state.websites.currentTabId, []),
  whitelistedDomains: state.thirdparty.whitelistedDomains,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchWhitelist: (data) => dispatch(setWhitelist(data)),
  dispatchShowWarning: () => dispatch(showWarning('refresh')),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThirdPartySetup);
