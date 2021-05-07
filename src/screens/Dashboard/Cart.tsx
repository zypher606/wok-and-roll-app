import React, { useState, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { ListItemSecondaryAction, Button, Snackbar } from '@material-ui/core';
import { ItemQuantity, Alert, CircularLoader } from '../../components';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import firebase from 'firebase';
import { v4 as uuidv4 } from "uuid";
import FastfoodIcon from '@material-ui/icons/Fastfood';

const db = firebase.firestore();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '36ch',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    itemBody: {
      paddingLeft: '6px'
    },
    orderNowBtn: {
      width: '100%',
    }
  }),
);

export default function Cart({ cart: defaultCart, handleOrderSuccess }: any) {
  const classes = useStyles();
  const [cart, setCart] = useState(defaultCart);
  const [openSuccessToast, setOpenSuccessToast] = useState(false);
  const [openErrorToast, setOpenErrorToast] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState('');
  const [orderSaveLoading, setOrderSaveLoading] = useState(false);

  useEffect(() => {
    setCart(defaultCart);
  }, [defaultCart]);

  const handleOrderConfirmation = async () => {
    setOrderSaveLoading(true);
    const size = (await db.collection('orders').get()).docs.length

    db.collection('orders').add({
      id: uuidv4(),
      orderNo: size + 1,
      cart,
      status: 'active',
      date: new Date().toISOString(),
    }).then(res => {
      setOpenSuccessToast(true);
      setWhatsAppMessage(`https://api.whatsapp.com/send?phone=+918133862037&text=Hi Wok and Roll, I would like to confirm my order number ${size + 1}. Kindly deliver my stuff at the below WhatsApp location.`);
      handleOrderSuccess();
      setOrderSaveLoading(false);
    }).catch(err => {
      setOpenErrorToast(true);
      setOrderSaveLoading(false);
    });
  }

  const handleWhatsAppMessageSend = () => {
    setOpenSuccessToast(false);
    window.open(whatsAppMessage);
  }

  const getTotalAmount = () => {
    let total = 0;
    cart.forEach((item: any) => {
      total += item.price * item.quantity;
    });
    return total;
  }

  return (

    <div>
      { 
        cart.length > 0 &&
        <div>
          <List className={classes.root}>
            {
              cart.map((item: any) => (
                <CartItem item={item} />
              ))
            }
            
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <div style={{paddingTop: '4px'}}>
                    <Typography
                      align="right"
                      variant="h5"
                      className={classes.inline}
                      color="textPrimary"
                      style={{float: 'right'}}
                    >
                      ₹{getTotalAmount()}
                    </Typography>
                    <Typography
                      component="span"
                      variant="h5"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      Total:
                    </Typography>
                  </div>
                }
                className={classes.itemBody}
              />
          

            </ListItem>
          </List>
          {
            getTotalAmount() < 200 &&
            <div>
              <Typography style={{color: 'red'}}>
                *Minimum amount is 200 to order
              </Typography>
              <br/>
            </div>
          }
          
          {
            orderSaveLoading === true &&
            <div style={{textAlign: 'center'}}>
              <CircularLoader />
            </div>
          }

          {
            orderSaveLoading === false &&
            <Button disabled={getTotalAmount() < 200} onClick={handleOrderConfirmation} size="large" className={classes.orderNowBtn} endIcon={<LocationOnIcon/>} variant="contained" color="primary">
              Share Location and Order
            </Button>
          }
          

        </div>

      }

      {
        cart.length === 0 && 
        <div style={{paddingTop: '30%'}}>
          <Typography align='center' variant='h4'>
            <FastfoodIcon style={{color: '#3f51b5', fontSize: '8rem'}} />
          </Typography>
          <Typography style={{color: '#3f51b5'}} align='center' variant='h5'>
            Your cart is empty! 
          </Typography>
          <Typography style={{color: '#3f51b5'}} align='center' variant='h5'>
            Try our dishes and escape lockdown boredom 😃
          </Typography>
        </div>
      }

      <Snackbar open={openSuccessToast} autoHideDuration={4000} onClose={handleWhatsAppMessageSend}>
        <Alert onClose={handleWhatsAppMessageSend} severity="success">
          Order successfull! Please share your WhatsApp location to get it delivered.
        </Alert>
      </Snackbar>

      <Snackbar open={openErrorToast} autoHideDuration={4000} onClose={() => setOpenErrorToast(false)}>
        <Alert onClose={() => setOpenErrorToast(false)} severity="error">
          Some error occured!
        </Alert>
      </Snackbar>
    </div>
    
    
  );
}

function CartItem({ item }: any) {
  const classes = useStyles();
  return (
    <div>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar style={{backgroundColor: '#3f51b5'}} className={classes.large} alt={item.name} src={item.imageURL} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <div style={{paddingTop: '4px'}}>
              <Typography
                align="right"
                variant="h6"
                className={classes.inline}
                color="textPrimary"
                style={{float: 'right'}}
              >
                ₹{item.price * item.quantity}
              </Typography>
              <div style={{fontSize: '1.2rem'}}>{item.name}</div>

            </div>
          }
          secondary={
            <div>
              
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                @ ₹{item.price} x {item.quantity}
              </Typography>
              
            </div>
            
          }
          className={classes.itemBody}
        />
     

      </ListItem>
      <Divider variant="inset" component="li" />
    </div>
  )
}