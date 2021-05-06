import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { ListItemSecondaryAction } from '@material-ui/core';
import { ItemQuantity } from '../../components';

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
    }
  }),
);

export default function Cart({ cart: defaultCart }: any) {
  const classes = useStyles();
  const [cart, setCart] = useState(defaultCart);

  return (
    <List className={classes.root}>
      {
        cart.map((item: any) => (
          <CartItem item={item} />
        ))
      }
      
    </List>
  );
}

function CartItem({ item }: any) {
  const classes = useStyles();
  return (
    <div>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar className={classes.large} alt={item.name} src={item.imageURL} />
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