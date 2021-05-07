import React, { Component } from 'react';
import { firebaseService } from '../services/firebase.service';
import { User } from '../models/User';
import logo from "../assets/images/logo.png";
import { LinearProgress } from '@material-ui/core';

export const withAuth = (AppComponent: any) => {

  return class AuthWrapper extends Component<any, any> {
    state = {
      authenticated: false,
      loading: true,
      userNameStatus: false,
    };

    setUserData = (user: any) => {
      User.getInstance().UserData = {
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber,
        avatar: user.photoURL,
      };
    };

    setAuthStatusSuccess = () =>
      this.setState({
        userNameStatus: true,
      });

    onAuthSuccess = (user: any) => {
      this.setUserData(user);
      // if (!user.displayName) {
      //   showToast(USER_SET_NAME_MESSAGE);
      //   PopupUtility(SetUserNamePopup, {
      //     setUserName: (name: string) => user.updateProfile({ displayName: name }),
      //   }).then(() => {
      //     this.setUserData(user);
      //     this.setAuthStatusSuccess();
      //   });
      // } else showToast(LOGGED_IN_MESSAGE(user.displayName));

      this.setAuthStatusSuccess();
      this.setState({
        authenticated: true,
        loading: false,
      });
    };

    onAuthFailed = () =>
      this.setState({
        authenticated: false,
        loading: false,
      });

    componentDidMount() {
      firebaseService.firebaseAuth().onAuthStateChanged((user: any) => {
        if (user) return this.onAuthSuccess(user);
        else return this.onAuthFailed();
      });
    }

    render(): JSX.Element {
      const { loading } = this.state;
      return (
        <>
          {loading ? 
            <div style={{textAlign: 'center'}}>
              <img className='logo' src={logo} alt="app logo" />
              <LinearProgress style={{width: '60%', marginLeft: '20%'}} />
            </div>
            : <AppComponent {...this.state} {...this.props} />}
        </>
      );
    }
  };
};
