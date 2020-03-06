import React, { useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parse } from 'tldts';

import orderBy from 'lodash/orderBy';
import isNil from 'lodash/isNil';

import TrackersSchema from 'popup/store/schemas/Trackers';
import { setCurrentWebsite } from 'popup/store/actions/currentWebsite';
import { setDetectedTrackers } from 'popup/store/actions/thirdparty';
import routes from 'popup/routes';

import { getCurrentTab } from 'helpers/tabs';
import { getMainDomainWithoutPrefix } from 'helpers/domains';

import { listenForBackground, stopListenerForBackground } from 'popup/background';
import { sendMessage, GET_BLOCKED_INFOS, REFRESH_BLOCKED_INFOS } from 'helpers/messages';
import { capitalize } from 'helpers/format';

import useTranslation from 'popup/hooks/useTranslation';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Screen from 'popup/components/dumb/Screen';
import Default from 'popup/components/screens/Default';
import ScreenError from 'popup/components/screens/Error';
import DefaultAppBar from 'popup/components/smart/DefaultAppBar';

const useStyles = makeStyles(() => ({
  content: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  },
  listItemEmpty: {
    textAlign: 'center',
  },
  arrowIcon: {
    marginLeft: '1rem',
  },
}));


const useFormatDetectedTrackers = () => useCallback((trackers, sort = false) => {
  const formattedTrackers = trackers.map((tracker) => {
    const { apps } = tracker;
    const blockedApps = apps.filter(((app) => app.blocked));
    return {
      ...tracker,
      blockedApps,
      isWhitelisted: blockedApps.length !== apps.length,
    };
  });
  return sort ? orderBy(formattedTrackers, ['isWhitelisted', 'name'], ['desc', 'asc']) : formattedTrackers;
}, []);

const useListenForBackgroundCb = (
  formatDetectedTrackers,
  dispatchDetectedTrackers,
) => useCallback((msg) => {
  if (msg.action === REFRESH_BLOCKED_INFOS) {
    const sorted = formatDetectedTrackers(msg.detectedTrackers, true);
    dispatchDetectedTrackers(sorted || []);
  }
}, [formatDetectedTrackers, dispatchDetectedTrackers]);

function Summary({
  dispatchDetectedTrackers,
  detectedTrackers,
  currentWebsite,
  dispatchCurrentWebsite,
  history,
}) {
  const classes = useStyles();
  const t = useTranslation();
  const [isFetching, setFetching] = React.useState(false);
  const [notLaunched, setNotLaunched] = React.useState(false);
  const empty = useMemo(() => detectedTrackers.length === 0, [detectedTrackers]);

  const formatDetectedTrackers = useFormatDetectedTrackers();
  const listenForBackgroundCb = useListenForBackgroundCb(
    formatDetectedTrackers,
    dispatchDetectedTrackers,
  );

  const formattedDetectedTrackers = useMemo(
    () => (formatDetectedTrackers(detectedTrackers)),
    [detectedTrackers, formatDetectedTrackers],
  );

  const getDetectedTrackers = useCallback(() => {
    if (!isFetching) {
      setFetching(true);
      sendMessage(GET_BLOCKED_INFOS)
        .then((response) => {
          const sorted = formatDetectedTrackers(response.detectedTrackers, true);
          dispatchDetectedTrackers(sorted || []);
        })
        .catch((err) => {
          if (err.message === 'not_launched') { setNotLaunched(true); }
        })
        .finally(() => { setFetching(false); });
    }

    listenForBackground(listenForBackgroundCb);

    return () => { stopListenerForBackground(listenForBackgroundCb); };
  }, [dispatchDetectedTrackers, formatDetectedTrackers, isFetching, listenForBackgroundCb]);

  const getCurrentWebsite = useCallback(() => {
    getCurrentTab().then(({ url, favIconUrl }) => {
      const { hostname, domain } = parse(url);
      dispatchCurrentWebsite({
        name: capitalize(getMainDomainWithoutPrefix(hostname)),
        hostname: isNil(domain) ? false : hostname,
        faviconUrl: favIconUrl,
      });
    });
  }, [dispatchCurrentWebsite]);

  const setupAction = useCallback((purpose) => {
    const nextParams = new URLSearchParams('');
    if (!isNil(purpose)) { nextParams.set('mainPurpose', purpose); }
    const query = nextParams.toString();
    history.push({ pathname: routes.setup, search: query });
  }, [history]);

  useEffect(getDetectedTrackers, []);
  useEffect(getCurrentWebsite, []);

  if (currentWebsite.hostname === false) { return <Default />; }

  if (notLaunched) { return <ScreenError />; }

  return (
    <Screen appBarContent={<DefaultAppBar />}>
      <Box p={3}>
        <Typography component="h2" variant="h5">
          {t('summary_thirdParty_title')}
        </Typography>
        <Card mb={3} variant="outlined">
          <CardContent className={classes.content}>
            <List aria-labelledby="list-apps">
              {
                empty && (
                  <ListItem
                    onClick={() => setupAction()}
                    button
                  >
                    <ListItemText
                      primary={
                        isFetching
                          ? <Skeleton variant="text" style={{ margin: 0 }} />
                          : t('summary_thirdParty_count_empty')
                      }
                      className={classes.listItemEmpty}
                    />
                  </ListItem>
                )
              }
              {
                formattedDetectedTrackers.map(({ name, apps, blockedApps }, index) => (
                  <Box key={name}>
                    {(index !== 0) && <Divider />}
                    <ListItem
                      onClick={() => setupAction(name)}
                      button
                    >
                      <ListItemText
                        id={`switch-list-label-${name}`}
                        primary={t(`thirdParty_purposes_${name}`)}
                      />

                      <Typography variant="caption">
                        {
                        `${t('summary_thirdParty_blocked', [blockedApps.length], { plural: true })} 
                        /
                        ${t('summary_thirdParty_detected', [apps.length], { plural: true })}`
                        }
                      </Typography>
                      <KeyboardArrowRight className={classes.arrowIcon} />
                    </ListItem>
                  </Box>
                ))
              }
            </List>
          </CardContent>
        </Card>
      </Box>

    </Screen>
  );
}

Summary.propTypes = {
  detectedTrackers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    whitelisted: PropTypes.bool,
    apps: PropTypes.arrayOf(PropTypes.shape(TrackersSchema)),
  })).isRequired,
  currentWebsite: PropTypes.shape({
    faviconUrl: PropTypes.string,
    name: PropTypes.string,
    hostname: PropTypes.string,
  }).isRequired,
  dispatchDetectedTrackers: PropTypes.func.isRequired,
  dispatchCurrentWebsite: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

// CONNECT
const mapStateToProps = (state) => ({
  detectedTrackers: state.thirdparty.detectedTrackers,
  currentWebsite: state.currentWebsite,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchDetectedTrackers: (data) => dispatch(setDetectedTrackers(data)),
  dispatchCurrentWebsite: (currentWebsite) => dispatch(setCurrentWebsite(currentWebsite)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
