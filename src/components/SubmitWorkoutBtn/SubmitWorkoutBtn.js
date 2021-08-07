import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  resetWorkoutStore,
  clearExercises,
  selectAllExercises,
} from '../../store/workoutSlice';
import { submitWorkoutBtnUtils as utils } from './submitWorkoutBtnUtils';
import classes from './SubmitWorkoutBtn.module.css';

export default function SubmitWorkoutBtn(props) {
  const { formIsValid, setInputAsTouched, shouldCreateNewWorkout, firebaseId } =
    props;

  const [error, setError] = useState({
    isError: false,
    msg: '',
    errorCode: null,
  });

  const history = useHistory();
  const exercises = useSelector(selectAllExercises);
  const { formData } = useSelector((state) => state.workout);
  const { uid, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [workoutNameChanged, setWorkoutNameChanged] = useState(false);
  const workoutNameRef = useRef(null);

  useEffect(() => {
    if (workoutNameRef.current !== formData.workoutName) {
      workoutNameRef.current = formData.workoutName;
      setWorkoutNameChanged(true);
    }
  }, [workoutNameRef, workoutNameChanged, formData.workoutName]);

  useEffect(() => {
    if (formIsValid && error.code === 'workoutNameFormError')
      setError({ ...error, isError: false, msg: '', code: null });
  }, [formIsValid, error]);

  useEffect(() => {
    if (error.code === 'nameTaken' && workoutNameChanged)
      setError({ isError: false, msg: '', errorCode: null });
  }, [error, workoutNameChanged]);

  const submitOnInvalidForm = () => {
    setInputAsTouched();
    setError({
      ...error,
      isError: true,
      msg: <p>A workout must have a name!</p>,
      code: 'workoutNameFormError',
    });
  };

  const redirectToMyProfile = () => {
    history.push({
      pathname: '/my-profile',
      state: {
        message: shouldCreateNewWorkout ? 'Workout created' : 'Workout Updated',
      },
    });
  };

  const setNameTakenError = () =>
    setError({
      ...error,
      isError: true,
      msg: <p>That name is already taken, please try a different name</p>,
      code: 'nameTaken',
    });

  const setAxiosError = () =>
    setError({
      ...error,
      isError: true,
      code: 'axios',
      msg: (
        <p style={{ color: 'red' }}>
          We're unable to update your workout right now. Please try again
        </p>
      ),
    });

  const submitValidForm = async () => {
    let nameTaken;
    const { workoutName: title } = formData;
    const { checkForPreviousNameUse, createWorkout, updateWorkout } = utils;

    if (shouldCreateNewWorkout || workoutNameChanged)
      nameTaken = await checkForPreviousNameUse(uid, accessToken, title);

    if (nameTaken) {
      setWorkoutNameChanged(false);
      setNameTakenError();
      return;
    }

    const workoutData = {
      title,
      targetAreaCode: formData.targetArea.value,
      secondaryTargetCode: formData.secondaryTarget.value,
      targetArea: formData.targetArea.label,
      secondaryTargetArea: formData.secondaryTarget.label,
      exercises,
    };

    const pushDataToFirebase = () =>
      shouldCreateNewWorkout
        ? createWorkout(uid, accessToken, workoutData)
        : updateWorkout(uid, accessToken, firebaseId, workoutData);

    await pushDataToFirebase().catch(() => setAxiosError());

    dispatch(clearExercises());
    dispatch(resetWorkoutStore());
    redirectToMyProfile();
  };

  const onSubmit = () =>
    formIsValid ? submitValidForm() : submitOnInvalidForm();

  return (
    <>
      <button className={`GlobalBtn-1 ${classes.Btn}`} onClick={onSubmit}>
        {shouldCreateNewWorkout ? 'Create Workout' : 'Update Workout'}
      </button>
      {error.isError && error.msg}
    </>
  );
}
