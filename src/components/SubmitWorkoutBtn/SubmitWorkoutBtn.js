import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { resetWorkoutStore } from '../../store/actions';
import classes from './SubmitWorkoutBtn.module.css';

const SubmitWorkoutBtn = (props) => {
  const [error, setError] = useState({
    isError: false,
    msg: '',
    errorCode: null,
  });
  const { exercises } = useSelector((state) => state.workout);
  const { formData } = useSelector((state) => state.workout);
  const { uid, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.formIsValid && error.code === 'workoutNameFormError')
      setError({ ...error, isError: false, msg: '', code: null });
  }, [props.formIsValid, error]);

  const submitOnInvalidForm = () => {
    props.setInputAsTouched();
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
    props.history.push({
      pathname: '/my-profile',
      state: {
        message: props.createNewWorkout ? 'Workout created' : 'Workout Updated',
      },
    });
  };

  const submitValidForm = async () => {
    if (
      props.createNewWorkout ||
      (props.titleChanged && !props.originalTitleEntact)
    )
      if (await checkForPreviousNameUse()) return;

    const workoutData = {
      title: props.title,
      targetAreaCode: props.targetAreaCode,
      secondaryTargetCode: props.secondaryTargetCode,
      targetArea: props.targetArea,
      secondaryTargetArea: props.secondaryTargetArea,
      exercises,
    };

    axios({
      method: props.createNewWorkout ? 'post' : 'put',
      url: props.createNewWorkout
        ? `https://workout-81691-default-rtdb.firebaseio.com/workouts/${uid}.json?auth=${accessToken}`
        : `https://workout-81691-default-rtdb.firebaseio.com/workouts/${uid}/${props.firebaseId}.json?auth=${accessToken}`,
      timeout: 5000,
      data: workoutData,
    })
      .then(() => {
        dispatch(resetWorkoutStore());
        props.clearAllFormInputs();
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
    props.formIsValid ? submitValidForm() : submitOnInvalidForm();

  return (
    <>
      <button className={`GlobalBtn-1 ${classes.Btn}`} onClick={onSubmit}>
        {props.createNewWorkout ? 'Create Workout' : 'Update workout'}
      </button>
      {error.isError ? error.msg : null}
    </>
  );
};

export default SubmitWorkoutBtn;
