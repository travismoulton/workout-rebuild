import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  resetWorkoutStore,
  selectAllExercises,
} from '../../store/workoutSlice';
import classes from './SubmitWorkoutBtn.module.css';

export default function SubmitWorkoutBtn(props) {
  const {
    formIsValid,
    setInputAsTouched,
    history,
    createNewWorkout,
    title,
    targetArea,
    targetAreaCode,
    secondaryTargetArea,
    secondaryTargetCode,
    firebaseId,
    clearAllFormInputs,
    titleChanged,
    originalTitleEntact,
  } = props;

  const [error, setError] = useState({
    isError: false,
    msg: '',
    errorCode: null,
  });
  const exercises = useSelector(selectAllExercises);
  const { formData } = useSelector((state) => state.workout);
  const { uid, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (formIsValid && error.code === 'workoutNameFormError')
      setError({ ...error, isError: false, msg: '', code: null });
  }, [formIsValid, error]);

  const submitOnInvalidForm = () => {
    setInputAsTouched();
    setError({
      ...error,
      isError: true,
      msg: <p>A workout must have a name!</p>,
      code: 'workoutNameFormError',
    });
  };

  const checkForPreviousNameUse = async () => {
    let nameTaken = false;
    await axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/workouts/${uid}.json?auth=${accessToken}`
      )
      .then((res) => {
        for (const key in res.data) {
          if (res.data[key].title === formData.workoutName) {
            setError({
              ...error,
              isError: true,
              msg: (
                <p>That name is already taken, please try a different name</p>
              ),
              code: 'nameTaken',
            });
            nameTaken = true;
          }
        }
      });

    return nameTaken;
  };

  const redirectToMyProfile = () => {
    history.push({
      pathname: '/my-profile',
      state: {
        message: createNewWorkout ? 'Workout created' : 'Workout Updated',
      },
    });
  };

  const submitValidForm = async () => {
    if (createNewWorkout || (titleChanged && !originalTitleEntact))
      if (await checkForPreviousNameUse()) return;

    const workoutData = {
      title,
      targetAreaCode,
      secondaryTargetCode,
      targetArea,
      secondaryTargetArea,
      exercises,
    };

    axios({
      method: createNewWorkout ? 'post' : 'put',
      url: createNewWorkout
        ? `https://workout-81691-default-rtdb.firebaseio.com/workouts/${uid}.json?auth=${accessToken}`
        : `https://workout-81691-default-rtdb.firebaseio.com/workouts/${uid}/${firebaseId}.json?auth=${accessToken}`,
      timeout: 5000,
      data: workoutData,
    })
      .then(() => {
        dispatch(resetWorkoutStore());
        clearAllFormInputs();
        redirectToMyProfile();
      })
      .catch((err) =>
        setError({
          ...error,
          isError: true,
          code: 'axios',
          msg: (
            <p style={{ color: 'red' }}>
              We're unable to update your workout right now. Please try again
            </p>
          ),
        })
      );
  };

  const onSubmit = () =>
    formIsValid ? submitValidForm() : submitOnInvalidForm();

  return (
    <>
      <button className={`GlobalBtn-1 ${classes.Btn}`} onClick={onSubmit}>
        {createNewWorkout ? 'Create Workout' : 'Update workout'}
      </button>
      {error.isError && error.msg}
    </>
  );
}
