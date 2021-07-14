import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import Input from '../../../components/UI/Input/Input';
import {
  authFail,
  authStart,
  authReset,
  authSuccess,
} from '../../../store/authSlice';
import classes from './Login.module.css';

export default function Login({ firebase }) {
  const [emailInput, setEmailInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'email',
      placeholder: 'Your Email Address',
    },
    value: '',
    validation: {
      required: true,
    },
    testid: 'Login__emailInput',
    label: 'Email address',
    valid: false,
    touched: false,
    id: 1,
  });

  const [passwordInput, setPasswordInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'password',
      placeholder: 'Password',
    },
    value: '',
    validation: {
      required: true,
    },
    testid: 'Login__passwordInput',
    label: 'Password',
    valid: false,
    touched: false,
    id: 2,
  });

  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const updatePassword = (e) => {
    setPasswordInput({ ...passwordInput, value: e.target.value });
  };

  const updateEmail = (e) => {
    setEmailInput({ ...emailInput, value: e.target.value });
  };

  const updateFunctions = [updateEmail, updatePassword];
  const formFields = [emailInput, passwordInput];

  const submitLogin = () => {
    dispatch(authStart());
    firebase
      .doSignInWithEmailAndPassword(emailInput.value, passwordInput.value)
      .then((userCredential) => {
        dispatch(authSuccess(userCredential.user));
        setErrorMessage(null);
      })
      .catch((err) => {
        dispatch(authFail(err));
        dispatch(authReset());
        setErrorMessage(err.message);
      });
  };

  // Redirect by checking for authUser. If there is a user, check for authUser property.
  // If authUser property, redirect to my-profile
  const redirect = user ? (
    user.authUser ? (
      <Redirect to="/my-profile" />
    ) : null
  ) : null;

  const form = formFields.map((el, i) => (
    <Input
      elementType={el.elementType}
      elementConfig={el.elementConfig}
      key={el.id}
      value={el.value}
      changed={updateFunctions[i]}
      label={el.label}
      classname="LoginInput"
      wrapperClass="LoginInputWrapper"
      testid={el.testid}
    />
  ));

  console.log(firebase);

  return (
    <>
      {redirect}
      <div>
        {errorMessage && <p>{errorMessage}</p>}
        {form}
        <button className={`GlobalBtn-1 ${classes.Btn}`} onClick={submitLogin}>
          Login
        </button>
      </div>
      <div className={classes.Links}>
        <p>
          Don't have an account?{' '}
          <Link className={classes.Link} to="/register">
            Register
          </Link>{' '}
          here
        </p>
        <Link className={classes.Link} to="/forgot-password">
          Forgot Password?
        </Link>
      </div>
    </>
  );
}
