import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { authLogout } from '../../store/authSlice';

export default function Logout({ firebase }) {
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.doSignOut();
    dispatch(authLogout());
  });

  return <Redirect to="/" />;
}
