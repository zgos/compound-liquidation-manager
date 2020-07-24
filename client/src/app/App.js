import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { startSaga } from './rootSaga';
import { makeStyles } from '@material-ui/core';
import UserBalance from '../component/userBalance';
import AppHeader from '../component/AppHeader';
import TransactionView from '../component/transactionView';
import Container from '../component/Container';
import { tokenAddress } from '../constant';

const useStyles = makeStyles(theme => ({
  transactionView: {
    marginTop: theme.spacing(2)
  },
  cardHeader: {
    color: '#707070'
  }
}));

const App = () => {
  const classes = useStyles();
  const [selected, setSelected] = useState('');
  const [contractAddress, setContractAddress] = useState();

  useEffect(() => {
    if (selected) {
      setContractAddress(tokenAddress[selected])
    }
  }, [selected])

  return (
    <React.Fragment>
      <AppHeader
        selected={selected}
        handleSelected={setSelected}
      />
      <Container maxWidth="lg">
        <Grid container spacing={2} justify='center'>
          <Grid item md={6} sm={12} >
            <Grid container spacing={2}>
              <Grid item md={12} className={classes.transactionView}>
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <TransactionView
                      title='Deposit'
                      selected={selected}
                      contractAddress={contractAddress}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TransactionView
                      title='Withdraw'
                      selected={selected}
                      contractAddress={contractAddress}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={12}>
                <UserBalance />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

const WrappedComponent = App

export default () => {
  startSaga();
  return <WrappedComponent />
};