import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Input from '../UI/Input/Input';
import { updateObject, checkValidityHandler } from '../../shared/utility';
import classes from './UpdatePassword.module.css';

export default function UpdatePassword({ firebase }) {
  const { email } = useSelector((state) => state.auth);
  const [currentPasswordInput, setCurrentPasswordInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'password',
      placeholder: 'Password',
    },
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    label: 'Current password',
    id: 'current',
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
    valid: false,
    touched: false,
    label: 'New password',
    id: 'password',
  });

  const [confirmPWInput, setConfirmPW] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'password',
      placeholder: 'Password',
    },
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    label: 'Confirm new password',
    id: 'confirm',
  });

  const [error, setError] = useState(null);
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    document.title = 'Update Password';
  }, []);

  const formFields = [currentPasswordInput, passwordInput, confirmPWInput];

  const checkFormValidity = (updatedInput) => {
    const oldForm = {
      current: currentPasswordInput,
      password: passwordInput,
      confirm: confirmPWInput,
    };

    const newForm = updateObject(oldForm, { [updatedInput.id]: updatedInput });

    let tempVal = true;

    for (let identifier in newForm)
      tempVal = newForm[identifier].valid && tempVal;

    setFormIsValid(tempVal);
  };

  const inputChangedHandler = (e, input) => {
    const updatedInput = updateObject(input, {
      value: e.target.value,
      valid: checkValidityHandler(e.target.value, input.validation),
      touched: true,
    });

    input.id === 'current'
      ? setCurrentPasswordInput(updatedInput)
      : input.id === 'password'
      ? setPasswordInput(updatedInput)
      : setConfirmPW(updatedInput);

    checkFormValidity(updatedInput);
  };

  const form = formFields.map((field) => (
    <Input
      key={field.id}
      elementConfig={field.elementConfig}
      elementType={field.elementType}
      label={field.label}
      value={field.value}
      changed={(e) => inputChangedHandler(e, field)}
      classname="UpdatePasswordInput"
      wrapperClass="UpdatePasswordInputWrapper"
    />
  ));

  const onSumbit = () => {
    const credential = firebase.generateCredntial(
      email,
      currentPasswordInput.value
    );

    if (
      currentPasswordInput.value &&
      passwordInput.value &&
      passwordInput.value === confirmPWInput.value
    )
      firebase
        .doReauthenticate(credential)
        .then(() => firebase.doPasswordUpdate(passwordInput.value))
        .catch((err) => {
          setError({
            code: err.code,
            message:
              err.code === 'auth/wrong-password' ? (
                <p>
                  Current password is incorrect. If you do not know you
                  password, <Link to="/reset-password">Reset it here</Link>
                </p>
              ) : (
                <p>An error occured</p>
              ),
          });
        })
        .catch((err) => console.log(err, '2'));
  };

  const submitBtn = (
    <button
      disabled={!formIsValid}
      className={`GlobalBtn-1 ${classes.Btn}`}
      onClick={onSumbit}
    >
      Update your password
    </button>
  );

  return (
    <>
      <h3 className={classes.Header}>Update my password</h3>
      {error && error.message}
      {form}
      {submitBtn}
      <p>
        Don't know your current password?{' '}
        <Link className={classes.Link} to="/forgot-password">
          Click here
        </Link>{' '}
        to reset it
      </p>
    </>
  );
}
