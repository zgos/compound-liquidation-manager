import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CardHeader from '@material-ui/core/CardHeader';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  heading: {
    textAlign: "center",
    marginTop: "5%"
  },
  title: {
    fontSize: '45px'
  },
  divier: {
    width: '90%',
    margin: "auto"
  },
  grid: {
    display: 'flex',
    width: 'fit-content',
    marginLeft: theme.spacing(2)
  },
  typography: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1.1)
  },
  primaryGrid: {
    marginLeft: '30%'
  },
  secondaryGrid: {
    marginLeft: '60%'
  }
}));

const UserBalance = props => {
  const classes = useStyles();

  return (
    <Card variant='outlined'>
      <CardHeader title='Balance' />
      <Divider></Divider>
      <CardContent>
        <Grid className={classes.grid}>
          <Grid className={classes.primaryGrid}>
            {Object.keys(props.balance).map((token, index) => (
              <Typography key={index} className={classes.typography}>{token}:</Typography>
            ))}

          </Grid>
          <Grid className={classes.secondaryGrid}>
            {Object.values(props.balance).map((value, index) => (
              <Typography key={index} className={classes.typography}>{value}</Typography>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const mapStateToProps = (state) => ({
  balance: state.userReducer.balance
});

export default connect(mapStateToProps)(UserBalance);
