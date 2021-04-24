import firebase from "firebase";
import firebaseConfig from "../config/firebase.config";
import { CAPTCHA_CONTAINER_ID } from "../config/app.config";

export class FirebaseService {
  public firebaseAuth: any = null;
  public firebaseDB: any = null;

  constructor(config: any) {
    console.log({firebaseConfig})
    firebase.initializeApp(config);
    this.firebaseAuth = firebase.auth;
    this.firebaseDB = firebase.database();
  }

  signInWithGoogle = () => {
    const provider = new this.firebaseAuth.GoogleAuthProvider();
    return this.firebaseAuth().signInWithPopup(provider);
  };

  signInWithFacebook = () => {
    const provider = new this.firebaseAuth.FacebookAuthProvider();
    return this.firebaseAuth().signInWithPopup(provider);
  };

  signOut = () => {
    return this.firebaseAuth().signOut();
  };

  signInWithPhoneNumber = (
    phoneNumber: string,
    successCallback: any,
    errorCallback: any
  ) => {
    const globalWindow: any = window;
    globalWindow.recaptchaVerifier = new this.firebaseAuth.RecaptchaVerifier(
      CAPTCHA_CONTAINER_ID,
      {
        size: "visible",
      }
    );
    const appVerifier = globalWindow.recaptchaVerifier;
    this.firebaseAuth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(successCallback)
      .catch((errorCallback));
  };
}
const firebaseInstance = new FirebaseService(firebaseConfig);

export { firebaseInstance as firebaseService };
