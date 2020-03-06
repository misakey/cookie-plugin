import React from 'react';
import PropTypes from 'prop-types';

import isNil from 'lodash/isNil';

import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    textTransform: 'uppercase',
    fontSize: '0.9rem',
    backgroundColor: theme.palette.grey[300],
    borderRadius: '10%',
    alignSelf: 'center',
    marginRight: theme.spacing(1),
  },
}));

function WebsiteAvatar({ src, name, ...rest }) {
  const classes = useStyles();

  const [isLoaded, setLoaded] = React.useState(false);
  const handleLoaded = React.useCallback(() => { setLoaded(true); }, [setLoaded]);

  const [isBroken, setBroken] = React.useState(false);
  const handleError = React.useCallback(() => {
    setBroken(true);
    handleLoaded();
  }, [setBroken, handleLoaded]);

  React.useEffect(() => {
    setLoaded(false);
    setBroken(false);
  }, [src]);

  return (
    <Avatar
      variant="circle"
      alt={name}
      src={isBroken ? null : src}
      className={classes.root}
      onError={handleError}
      onLoad={handleLoaded}
      {...rest}
    >
      {(isNil(src) || !isLoaded || !isBroken) && name.slice(0, 3)}
    </Avatar>
  );
}

WebsiteAvatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
};

WebsiteAvatar.defaultProps = {
  src: undefined,
  name: '',
};

export default WebsiteAvatar;
