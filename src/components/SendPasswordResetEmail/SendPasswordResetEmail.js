import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import classes from './SendPasswordResetEmail.module.css';
import Input from '../UI/Input/Input';

export default function SendPasswordResetEmail({ firebase }) {
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
    label: 'Email Address',
    id: 1,
  });

  const [error, setError] = useState(null);
  const [passwordRest, setPasswordReset] = useState(false);

  useEffect(() => {
    document.title = 'Reset Password';
  }, []);

  useEffect(() => {
    if (error) if (emailInput.value && error.code === 'noEmail') setError(null);
  }, [error, emailInput]);

  const onSubmit = () => {
    if (emailInput.value) {
      firebase
        .doPasswordReset(emailInput.value)
        .then(() => setPasswordReset(true))
        .catch((err) =>
          setError({ msg: <p style={{ color: 'red' }}>{err.message}</p> })
        );
    } else {
      setError({
        isError: true,
        msg: (
          <p style={{ color: 'red' }}>
            Must provide an email in order to reset
          </p>
        ),
        code: 'noEmail',
      });
    }
  };

  const submitBtn = (
    <button className={`GlobalBtn-1 ${classes.Btn}`} onClick={onSubmit}>
      Reset password
    </button>
  );

  const inputField = (
    <Input
      elementType={emailInput.elementType}
      elementConfig={emailInput.elementConfig}
      label={emailInput.label}
      changed={(e) => setEmailInput({ ...emailInput, value: e.target.value })}
      value={emailInput.value}
      classname="ResetPasswordInput"
      wrapperClass="ResetPasswordInputWrapper"
    />
  );

  const afterRestDisplay = passwordRest ? (
    <div className={classes.AfterResetDisplay}>
      <p>If an account with that password exists, an email will be sent.</p>
      <Link className={classes.Link} to="/login">
        Return to the login page after resetting your password
      </Link>
    </div>
  ) : null;

  return (
    <>
      <h3 className={classes.Header}>Send a password reset email</h3>
      {error && error.msg}
      {afterRestDisplay}
      {inputField}
      {submitBtn}
    </>
  );
}
