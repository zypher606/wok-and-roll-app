import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import CallIcon from '@material-ui/icons/Call';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import logo from "../../assets/images/logo.png";
import { firebaseService } from '../../services/firebase.service';
import { Typography, Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  logo: {
    width: '40%',
    border: 'solid 1px #0d3360',
    borderRadius: '50%',
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    marginTop: '7%',
    marginBottom: '26px',
  }
}));


export default function Account() {

  const classes = useStyles();

  const handleLogout = () => {
    firebaseService.signOut();
  }

  const handleRestaurantCall = () => {
    window.open('tel:+919101184926');
  }

  return (
    <div className={classes.root}>
      <div style={{textAlign: 'center'}}>
        <img className={classes.logo} src={logo} alt="app logo" />
      </div>
      <Typography align='center'>
        Hi User, we at <strong>Wok & Roll</strong> make sure that you enjoy each and every bite of our inhouse engineered dishes. Feel free to reach us out if you have any queries.
      </Typography>
      <br/>
      <br/>
      <Divider/>
      <br/>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button onClick={handleRestaurantCall}>
          <ListItemIcon>
            <CallIcon />
          </ListItemIcon>
          <ListItemText primary="Call Restaurant" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  )
}