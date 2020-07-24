import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import { makeStyles, TextField, Button } from '@material-ui/core';
import { createAction } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import BigNumber from "big-number";

const depositTransaction = createAction('DEPOSIT_TRANSACTION')
const widrawlTransaction = createAction('WITHDRAW_TRANSACTION')

const useStyles = makeStyles(theme => ({
  grid: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  secondaryGrid: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  cardContent: {
    padding: theme.spacing(0)
  },
  typography: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    fontSize: 14,
    width: 'fit-content'
  },
  input: {
    width: '90%',
  },
  secondaryTypography: {
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    fontSize: 12,
    width: 'fit-content'
  },
  button: {
    width: '28%',
    marginLeft: '4%',
    marginTop: '2%',
    background: 'rgba(0, 143, 251, 0.85)',
    "&:hover": {
      backgroundColor: 'rgba(0, 143, 251, 0.32)'
    },
    color: 'white'
  },
  maxButton: {
    marginLeft: theme.spacing(1),
    background: 'rgba(0, 143, 251, 0.85)',
    "&:hover": {
      backgroundColor: 'rgba(0, 143, 251, 0.32)'
    },
    color: 'white'
  },
  span: {
    fontSize: 12,
    marginLeft: '6%',
    color: '#e83f4c'
  }
}));

const TransactionView = (props) => {
  const classes = useStyles();
  const [amount, setAmount] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  const handleClick = () => {
    const value = BigNumber(parseFloat(amount) * 10 ** parseInt(props.contractAddress[1])).toString();
    if (props.title === 'Deposit') {
      props.depositTransaction({ contractAddress: props.contractAddress[0], amount: value })
    } else {
      props.widrawlTransaction({ contractAddress: props.contractAddress[0], amount: value })
    }
  }

  useEffect(() => {
    setAmount('')
  }, [props.selected])

  useEffect(() => {
    if (props.network === 'kovan' && props.selected) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }, [props.network, props.selected])

  return (
    <Grid className={classes.card}>
      <Card variant='outlined'>
        <CardHeader title={props.title} />
        <Divider />
        <CardContent className={classes.cardContent}>
          <Typography className={classes.typography}>Amount To {props.title}:</Typography>
          <Box display="flex" paddingX="12px">
            <TextField
              disabled={isDisabled}
              value={amount}
              type='number'
              variant='outlined'
              size='small'
              className={classes.input}
              onChange={(event) => setAmount(event.target.value)}
            />
          </Box>
          <Button size='small' className={classes.button} onClick={() => handleClick()} disabled={isDisabled} >{props.title}</Button>
        </CardContent>
      </Card>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  network: state.userReducer.network
});


export default connect(mapStateToProps, { depositTransaction, widrawlTransaction })(TransactionView);
