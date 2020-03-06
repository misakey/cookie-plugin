import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import useTranslation from 'popup/hooks/useTranslation';
import Screen from 'popup/components/dumb/Screen';
import DefaultAppBar from 'popup/components/smart/DefaultAppBar';

import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { sendMessage, RESTART_BG } from 'helpers/messages';


// STYLES
const useStyles = makeStyles((theme) => ({
  iconAlert: {
    display: 'flex',
    alignSelf: 'center',
  },
  actions: {
    padding: theme.spacing(1, 2),
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

function ScreenError() {
  const classes = useStyles();
  const restartBackground = useCallback(() => { sendMessage(RESTART_BG); }, []);
  const t = useTranslation();

  return (
    <Screen appBarContent={<DefaultAppBar />}>
      <Box p={3}>
        <Card p={3} variant="outlined">
          <CardContent>
            <Alert variant="outlined" severity="error" classes={{ icon: classes.iconAlert }}>
              {t('summary_thirdParty_error_description')}
            </Alert>
          </CardContent>
          <CardActions classes={{ root: classes.actions }}>
            <Button onClick={restartBackground} variant="contained" size="small" color="secondary">
              {t('summary_thirdParty_error_button')}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Screen>
  );
}

export default ScreenError;
