import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import {
  authFail,
  authStart,
  authSuccess,
  authReset,
} from '../../../../store/authSlice';
import classes from './GuestLogin.module.css';

export default function GuestLogin({ firebase }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const history = useHistory();

  function submitLogin() {
    dispatch(authStart());
    firebase
      .doSignInWithEmailAndPassword('commonguest@guest.com', 'pass1234')
      .then((userCredential) => {
        dispatch(authSuccess(userCredential.user));
        history.push('/my-profile');
      })
      .catch((err) => {
        dispatch(authFail(err));
        dispatch(authReset());
      });
  }

  return (
    <>
      {user && <Redirect to="/my-profile" />}
      <li className={classes.Link}>
        <p onClick={submitLogin}>Cotninue as guest</p>
      </li>
    </>
  );
}
