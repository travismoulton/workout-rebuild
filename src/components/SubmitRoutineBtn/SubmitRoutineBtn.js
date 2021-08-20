import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { submitRoutineBtnUtils as utils } from './submitRoutineBtnUtils';
import { fetchActiveRoutine } from '../../store/favoritesSlice';

export default function SubmitRoutineBtn(props) {
  const {
    valid,
    containsWorkout,
    isActiveRoutine,
    history,
    shouldCreateNewRoutine,
    title,
    titleChanged,
    originalTitleEntact,
    firebaseId,
    workouts,
  } = props;

  const routineNameRef = useRef(null);
  const [routineNameChanged, setRoutineNameChanged] = useState(false);
  const [error, setError] = useState({ isError: false, code: '', msg: '' });
  const { activeRoutine } = useSelector((state) => state.favorites);
  const { uid, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const shouldBeActiveRoutine = isActiveRoutine || !activeRoutine;
  const { checkForPreviousNameUse, createRoutine, updateRoutine } = utils;

  useEffect(() => {
    if (routineNameRef.current !== title) {
      routineNameRef.current = title;
      if (!routineNameChanged) setRoutineNameChanged(true);
    }
  }, [routineNameChanged, routineNameRef, title]);

  useEffect(() => {
    if (valid && error.code === 'noRoutineName')
      setError({ isError: false, msg: '', code: null });
  }, [valid, error]);

  useEffect(() => {
    if (containsWorkout && error.code === 'noWorkouts')
      setError({ isError: false, code: '', msg: '' });
  }, [containsWorkout, error]);

  useEffect(() => {
    if (routineNameChanged && error.code === 'nameTaken')
      setError({ isError: false, code: '', msg: '' });
  }, [routineNameChanged, error]);

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
      isError: true,
      code: 'axios',
      msg: (
        <p style={{ color: 'red' }}>
          We weren't able to create this workout, please try agian
        </p>
      ),
    });

  const setNoWorkoutsError = () =>
    setError({
      isError: true,
      code: 'noWorkouts',
      msg: <p>A routine must contain at least one workout</p>,
    });

  const setNoRoutineNameError = () =>
    setError({
      isError: true,
      code: 'noRoutineName',
      msg: <p>A routine must have a title</p>,
    });

  const redirectToMyProfile = () =>
    history.push({
      pathname: '/my-profile',
      state: {
        message: shouldCreateNewRoutine ? 'Routine created' : 'Routine Updated',
      },
    });

  const onSubmit = async () => {
    if (!containsWorkout) {
      setNoWorkoutsError();
      return;
    }

    if (!valid) {
      setNoRoutineNameError();
      return;
    }

    if (shouldCreateNewRoutine || (titleChanged && !originalTitleEntact)) {
      const nameTaken = await checkForPreviousNameUse(title, uid, accessToken);

      if (nameTaken) {
        setRoutineNameChanged(false);
        setNameTakenError();
        return;
      }
    }

    const routineData = {
      title,
      workouts,
      activeRoutine: shouldBeActiveRoutine,
    };

    const pushDataToFirebase = () =>
      shouldCreateNewRoutine
        ? createRoutine(routineData, uid, accessToken)
        : updateRoutine(routineData, uid, accessToken, firebaseId);

    await pushDataToFirebase().catch(() => setAxiosError());

    if (shouldBeActiveRoutine)
      dispatch(fetchActiveRoutine({ uid, accessToken }));

    redirectToMyProfile();
  };

  return (
    <>
      <button
        className="GlobalBtn-1"
        onClick={onSubmit}
        style={{ width: '20rem', marginTop: '2rem' }}
      >
        {shouldCreateNewRoutine ? 'Create new routine' : 'Edit routine'}
      </button>
      {error.isError && error.msg}
    </>
  );
}
