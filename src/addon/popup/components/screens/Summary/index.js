import React, { useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parse } from 'tldts';

import isNil from 'lodash/isNil';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';

import RequestsSchema from 'store/schemas/Requests';
import routes from 'popup/routes';

import { getCurrentTab } from 'helpers/tabs';
import { getMainDomainWithoutPrefix } from 'helpers/domains';

import { capitalize } from 'helpers/format';

import useTranslation from 'popup/hooks/useTranslation';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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
import DefaultAppBar from 'popup/components/smart/DefaultAppBar';
import { addToWebsitesInfo, setCurrentTabId } from 'store/actions/websites';

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

function Summary({ detectedRequestsForTab, currentTabId, currentWebsite, dispatch, history }) {
  const classes = useStyles();
  const t = useTranslation();

  const detectedForTabByPurposes = useMemo(
    () => Object.entries(groupBy(detectedRequestsForTab, 'mainPurpose'))
      .map(([mainPurpose, apps]) => ({
        purpose: mainPurpose,
        blocked: apps.filter(((app) => app.blocked)).length,
        total: apps.length,
      })),
    [detectedRequestsForTab],
  );

  const empty = useMemo(() => detectedForTabByPurposes.length === 0, [detectedForTabByPurposes]);

  const getCurrentWebsite = useCallback(() => {
    getCurrentTab().then(({ id, url, favIconUrl }) => {
      const { hostname, domain } = parse(url);
      dispatch(addToWebsitesInfo(currentTabId, {
        name: capitalize(getMainDomainWithoutPrefix(hostname)),
        hostname: isNil(domain) ? false : hostname,
        faviconUrl: favIconUrl,
      }));
      dispatch(setCurrentTabId(id));
    });
  }, [currentTabId, dispatch]);

  const setupAction = useCallback((purpose) => {
    const nextParams = new URLSearchParams('');
    if (!isNil(purpose)) { nextParams.set('mainPurpose', purpose); }
    const query = nextParams.toString();
    history.push({ pathname: routes.setup, search: query });
  }, [history]);

  useEffect(
    () => { if (isNil(currentWebsite) || isNil(currentTabId)) { getCurrentWebsite(); } },
    [currentTabId, currentWebsite, getCurrentWebsite],
  );

  if (!isNil(currentWebsite) && currentWebsite.hostname === false) { return <Default />; }

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
                      primary={t('summary_thirdParty_count_empty')}
                      className={classes.listItemEmpty}
                    />
                  </ListItem>
                )
              }
              {
                detectedForTabByPurposes.map(({ purpose, total, blocked }, index) => (
                  <Box key={purpose}>
                    {(index !== 0) && <Divider />}
                    <ListItem
                      onClick={() => setupAction(purpose)}
                      button
                    >
                      <ListItemText
                        id={`switch-list-label-${purpose}`}
                        primary={t(`thirdParty_purposes_${purpose}`)}
                      />

                      <Typography variant="caption">
                        {
                        `${t('summary_thirdParty_blocked', [blocked], { plural: true })} 
                        /
                        ${t('summary_thirdParty_detected', [total], { plural: true })}`
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
  detectedRequestsForTab: PropTypes.arrayOf(PropTypes.shape(RequestsSchema)).isRequired,
  currentTabId: PropTypes.number,
  currentWebsite: PropTypes.shape({
    faviconUrl: PropTypes.string,
    name: PropTypes.string,
    hostname: PropTypes.string,
  }),
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

Summary.defaultProps = {
  currentWebsite: null,
  currentTabId: null,
};

// CONNECT
const mapStateToProps = (state) => ({
  detectedRequestsForTab: get(state.thirdparty.detectedRequests, state.websites.currentTabId, []),
  currentWebsite: get(state.websites.infos, state.websites.currentTabId, null),
  currentTabId: state.websites.currentTabId,
});

export default connect(mapStateToProps)(Summary);
