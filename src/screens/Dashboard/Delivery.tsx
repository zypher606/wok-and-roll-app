import React from 'react';
import { Typography, makeStyles, Theme, createStyles, Button } from '@material-ui/core';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CallIcon from '@material-ui/icons/Call';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    orderNowBtn: {
      width: '100%',
    },
    callRestaurantBtn: {
      width: '100%',
      backgroundColor: 'red',
    }
  }),
);

export default function Delivery({activeOrders}: any) {
  const classes = useStyles();

  const openWhatsApp = () => {
    const size = 4;
    window.open(`https://api.whatsapp.com/send?phone=+918133862037&text=Hi Wok and Roll, I would like to confirm my order number ${size + 1}. Kindly deliver my stuff at the below WhatsApp location.`);
  }

  const callRestaurant = () => {
    window.open('tel:+919101184926');
  }

  return (
    <div>

      {
        activeOrders.length === 0 &&
        <div style={{paddingTop: '30%'}}>
          <Typography align='center' variant='h4'>
            <FastfoodIcon style={{color: '#3f51b5', fontSize: '8rem'}} />
          </Typography>
          <Typography style={{color: '#3f51b5'}} align='center' variant='h5'>
            No orders! 
          </Typography>
          <Typography style={{color: '#3f51b5'}} align='center' variant='h5'>
            Try our awesome dishes and escape lockdown boredom 😃
          </Typography>
        </div>
      }

      {
        activeOrders.length > 0 &&
        <div style={{paddingTop: '26%'}}>
          <Typography align='center' variant='h4'>
            <DirectionsBikeIcon style={{color: '#3f51b5', fontSize: '8rem'}} />
          </Typography>
          <Typography style={{color: '#3f51b5'}} align='center' variant='h5'>
            Order No. #{activeOrders[0].orderNo}
          </Typography>
          <Typography style={{color: '#3f51b5'}} align='center' variant='h6'>
            Our delivery guy will be at your shared WhatsApp location in 35 mins.
          </Typography>

          <Button onClick={openWhatsApp} size="large" className={classes.orderNowBtn} endIcon={<LocationOnIcon/>} variant="contained" color="primary">
            Open WhatsApp to share location
          </Button>
          <br/>
          <br/>
          <Button onClick={callRestaurant} size="large" className={classes.callRestaurantBtn} endIcon={<CallIcon/>} variant="contained" color="primary">
            Call Restaurant
          </Button>
        </div>
      }

    </div>
    
  )
}