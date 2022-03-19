import React from 'react';
import {Box, LinearProgress,} from '@material-ui/core';

import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles((palette) => ({
  root: {
    // alignItems: 'center',
    // backgroundColor: palette.background.default,
    // display: 'flex',
    // flexDirection: 'column',
    // height: '100%',
    // justifyContent: 'center',
    // left: 0,
    // padding: 3,
    // position: 'fixed',
    // top: 0,
    // width: '100%',
    // zIndex: 2000
  }
}));

const SlashScreen = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box width={400}>
        <LinearProgress />
      </Box>
    </div>
  );
}

export default SlashScreen;
