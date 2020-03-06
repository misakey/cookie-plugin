import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import useTranslation from 'popup/hooks/useTranslation';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

// HOOKS
const useStyles = makeStyles((theme) => ({
  container: {
    height: 'inherit',
    flexGrow: 1,
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    width: '70%',
  },
  catchphrase: {
    fontSize: `calc(${theme.typography.h5.fontSize} + 1px)`,
    fontWeight: 'bold',
  },
}));

// COMPONENTS
const DefaultScreen = () => {
  const classes = useStyles();
  const t = useTranslation();

  return (
    <Box className={classes.container} display="flex" justifyContent="center" alignItems="center">
      <Typography className={classes.title}>
        <span className={classes.catchphrase}>{t('invalidWebsite_catchPhrase')}</span>
        {t('invalidWebsite_text')}
      </Typography>
    </Box>
  );
};

export default DefaultScreen;
