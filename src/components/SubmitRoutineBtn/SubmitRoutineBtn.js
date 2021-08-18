import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchActiveRoutine } from '../../store/actions';
import { submitRoutineBtnUtils as utils } from './submitRoutineBtnUtils';

export default function SubmitRoutineBtn(props) {
  const {
    valid,
    containsWorkout,
    isActiveRoutine,
    history,
    createNewRoutine,
    title,
    titleChanged,
    originalTitleEntact,
    firebaseId,
    workouts,
  } = props;

  const { checkForPreviousNameUse, createRoutine, updateRoutine } = utils;

  const [error, setError] = useState({ isError: false, code: '', msg: '' });
  const [shouldBeActiveRoutine, setShouldBeActiveRoutine] = useState(false);
  const { activeRoutine } = useSelector((state) => state.favorites);
  const { uid, accessToken } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (valid && error.code === 'noRoutineName')
      setError({ isError: false, msg: '', code: null });
  }, [valid, error]);

  useEffect(() => {
    if (containsWorkout() && error.code === 'noWorkouts')
      setError({ isError: false, code: '', msg: '' });
  }, [containsWorkout, error]);

  useEffect(() => {
    setShouldBeActiveRoutine(isActiveRoutine || !activeRoutine);
  }, [isActiveRoutine, activeRoutine]);

  const setNameTakenError = () =>
    setError({
      isError: true,
      code: 'nameTaken',
      msg: (
        <p>That routine name is already taken, please try a different name</p>
      ),
    });

  const setAxiosError = () =>
    setError({
      ...error,
      isError: true,
      code: 'axios',
      msg: (
        <p style={{ color: 'red' }}>
          We weren't able to create this workout, please try agian
        </p>
      ),
    });

  const redirectToMyProfile = () => {
    history.push({
      pathname: '/my-profile',
      state: {
        message: createNewRoutine ? 'Routine created' : 'Routine Updated',
      },
    });
  };

  const onSubmit = async () => {
    if (!containsWorkout()) {
      setError({
        isError: true,
        code: 'noWorkouts',
        msg: <p>A routine must contain at least one workout</p>,
      });
      return;
    }

    if (!valid) {
      setError({
        isError: true,
        code: 'noRoutineName',
        msg: <p>A routine must have a title</p>,
      });
      return;
    }

    let nameTaken;

    if (createNewRoutine || (titleChanged && !originalTitleEntact))
      nameTaken = checkForPreviousNameUse();

    if (nameTaken) {
      setNameTakenError();
      return;
    }

    const routineData = {
      title,
      workouts,
      activeRoutine: shouldBeActiveRoutine,
    };

    const pushDataToFirebase = () =>
      createNewRoutine
        ? createRoutine(uid, accessToken, routineData)
        : updateRoutine(uid, accessToken, firebaseId, routineData);

    pushDataToFirebase
      .then(() => {
        if (shouldBeActiveRoutine)
          dispatch(fetchActiveRoutine(uid, accessToken));
        redirectToMyProfile();
      })
      .catch(() => setAxiosError());
  };

  return (
    <>
      <button
        className="GlobalBtn-1"
        onClick={onSubmit}
        style={{ width: '20rem', marginTop: '2rem' }}
      >
        {createNewRoutine ? 'Create new routine' : 'Edit routine'}
      </button>
      {error.isError ? error.msg : null}
    </>
  );
}
