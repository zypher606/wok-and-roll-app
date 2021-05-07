import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd
} from "@react-firebase/auth";
import firebaseConfig from "../../config/firebase.config";
import logo from "../../assets/images/logo.png";
import './login.scss';
import { TextField, Button, Container } from "@material-ui/core";
import { firebaseService } from "../../services/firebase.service";
import { CAPTCHA_CONTAINER_ID } from "../../config/app.config";
import { CircularLoader } from "../../components";
import { v4 as uuidv4 } from "uuid";

const db = firebase.firestore();

export default function Login() {

  const [mobile, setMobile]: any = useState('');
  const [otp, setOtp]: any = useState('');
  const [confirmation, setConfirmation]: any = useState(null);
  const [error, setError]: any = useState(null);
  const [hasOtpSent, setHasOtpSent] = useState(false);
  const [authIsLoading, setAuthIsLoading] = useState(false);

  const requestOtp = () => {
    setHasOtpSent(false);
    firebaseService.signInWithPhoneNumber(
      `+91${mobile}`, 
      (success: any) => {
        setHasOtpSent(true);
        setConfirmation(success);
        setAuthIsLoading(false);
      },
      (error: any) => {
        console.log({error});
        setError(error);
        setAuthIsLoading(false);
      }
    );
  };

  const verifyOtp = () => {
    if (isOTPSent()) {
      setError(null);
      setAuthIsLoading(true);
      confirmation
        .confirm(otp)
        .then((success: any) => {
          handleUserCollectionUpdate(success);
          setAuthIsLoading(false);
        })
        .catch((error: any) => {
          setAuthIsLoading(false);
          setError(error);
        });
    }
  };

  const handleUserCollectionUpdate = (res: any) => {
    if (!res.additionalUserInfo.isNewUser) return;

    const user = {
      id: uuidv4(),
      displayName: res.user.displayName,
      phoneNumber: res.user.phoneNumber,
      emailVerified: res.user.emailVerified,
      dateCreated: new Date().toISOString(),
    }

    db.collection('users').add(user)
    .then(res => {
      // console.log('user saved successfully');
    }).catch(err => {});
  }

  const isOTPSent = () => confirmation && confirmation.confirm;

  return (
    <div className="screen-container">
      <Container>
        <img className="logo" src={logo} alt="app logo" />

        <form onSubmit={(e) => e.preventDefault()} className="loginForm" noValidate autoComplete="off">
          {
            !hasOtpSent &&
            <div>
              <TextField onChange={(e) => setMobile(e.target.value)} className="mobile" type="number" label="Mobile Number" variant="outlined" />
              <br/>
              <div id={CAPTCHA_CONTAINER_ID} />
              
              <Button disabled={!mobile.match(/^\d{10}$/)} onClick={requestOtp} size='large' className="loginBtn" variant="contained" color="primary">
                Login
              </Button>
              
            </div>
          }

          {
            hasOtpSent &&
            <div>
              <TextField onChange={(e) => setOtp(e.target.value)} className="mobile" type="number" label="Your OTP" variant="outlined" />
              <br/>
              {
                authIsLoading === true &&
                <div style={{textAlign: 'center'}}>
                  <CircularLoader />
                </div>
              }

              {
                authIsLoading === false &&
                <Button disabled={!otp.match(/^\d{6}$/)} onClick={verifyOtp} size='large' className="loginBtn" variant="contained" color="primary">
                  Verify OTP
                </Button>
              }
              
            </div>
          }
          
        </form>
      </Container>
    </div>
  )
}