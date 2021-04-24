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

export default function Login() {

  const [mobile, setMobile]: any = useState('');
  const [otp, setOtp]: any = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation]: any = useState(null);
  const [error, setError]: any = useState(null);
  const [hasOtpSent, setHasOtpSent] = useState(false);

  const requestOtp = () => {
    setHasOtpSent(false);
    setLoading(true);
    firebaseService.signInWithPhoneNumber(
      `+91${mobile}`, 
      (success: any) => {
        setHasOtpSent(true);
        setConfirmation(success)
      },
      (error: any) => {
        console.log({error});
        setError(error);
      }
    );
  };

  const verifyOtp = () => {
    if (isOTPSent()) {
      setError(null);
      setLoading(true);
      confirmation
        .confirm(otp)
        .then(() => {
          // onSuccessButtonClick();
          setLoading(false);
        })
        .catch((error: any) => {
          setLoading(false);
          setError(error);
        });
    }
  };

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
              <div  id={CAPTCHA_CONTAINER_ID} />
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
              <Button disabled={!otp.match(/^\d{6}$/)} onClick={verifyOtp} size='large' className="loginBtn" variant="contained" color="primary">
                Verify OTP
              </Button>
            </div>
          }
          
        </form>
      </Container>
    </div>
  )
}