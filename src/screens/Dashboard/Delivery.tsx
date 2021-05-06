import React from 'react';
import { Typography } from '@material-ui/core';
import FastfoodIcon from '@material-ui/icons/Fastfood';

export default function Delivery() {

  return (
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
  )
}