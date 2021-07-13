import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { authFail, authStart, authReset } from '../../../store/authSlice';
import Input from '../../../components/UI/Input/Input';
import classes from './Register.module.css';

export default function Register(props) {
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
    valid: false,
    touched: false,
    label: 'Email Adress',
    id: 1,
  });

  const [userNameInput, setUserNameInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Your User Name',
    },
    value: '',
    validation: {
      required: true,
    },
    label: 'Username',
    valid: false,
    touched: false,
    id: 2,
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
    label: 'Password',
    valid: false,
    touched: false,
    id: 3,
  });

  const [confirmPWInput, setConfirmPW] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'password',
      placeholder: 'Confirm Password',
    },
    value: '',
    validation: {
      required: true,
    },
    label: 'Confirm Password',
    valid: false,
    touched: false,
    id: 4,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = 'Register';
  }, []);

  const updateEmail = (e) => {
    setEmailInput({ ...emailInput, value: e.target.value });
  };

  const updateUserName = (e) => {
    setUserNameInput({ ...userNameInput, value: e.target.value });
  };

  const updatePassword = (e) => {
    setPasswordInput({ ...passwordInput, value: e.target.value });
  };

  const updateConfirmPW = (e) => {
    setConfirmPW({ ...confirmPWInput, value: e.target.value });
  };

  const updateFunctions = [
    updateEmail,
    updateUserName,
    updatePassword,
    updateConfirmPW,
  ];
  const formFields = [emailInput, userNameInput, passwordInput, confirmPWInput];

  const submitRegister = () => {
    if (passwordInput.value === confirmPWInput.value) {
      setErrorMessage('');
      dispatch(authStart());

      props.firebase
        .doCreateUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then((userCredential) => {
          props.firebase.updateUserProfile(userNameInput.value).then(() => {
            dispatch(authReset());
            props.history.push('/');
          });
        })
        .catch((err) => {
          dispatch(authFail(err));
          dispatch(authReset());
          setErrorMessage(err.message);
        });
    } else if (passwordInput.value !== confirmPWInput.value) {
      setErrorMessage('Passwords do not match');
    }
  };

  const form = formFields.map((el, i) => (
    <Input
      elementType={el.elementType}
      elementConfig={el.elementConfig}
      key={el.id}
      value={el.value}
      changed={updateFunctions[i]}
      label={el.label}
      classname="RegisterInput"
      wrapperClass="RegisterInputWrapper"
    />
  ));

  return (
    <>
      {errorMessage && <p>{errorMessage}</p>}
      {form}
      <button className={`GlobalBtn-1 ${classes.Btn}`} onClick={submitRegister}>
        Register
      </button>
      <p>
        Already have an account?{' '}
        <Link className={classes.Link} to="/login">
          Login here
        </Link>
      </p>
    </>
  );
}
