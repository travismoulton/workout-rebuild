import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import WorkoutLink from './WorkoutLink/WorkoutLink';
import classes from '../UserProfile.module.css';
import { setWorkouts, toggleRoutineRefresh } from '../../../store/actions';

const Workouts = (props) => {
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);
  const [workoutDeleted, setWorkoutDeleted] = useState(false);

  const { user, uid, accessToken } = useSelector((state) => state.auth);
  const { workouts, routines } = useSelector((state) => state.userProfile);
  const dispatch = useDispatch();

  const fetchWorkouts = useCallback(() => {
    axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/workouts/${uid}.json?auth=${accessToken}`,
        { timeout: 5000 }
      )
      .then((res) => {
        if (res.data) {
          const tempArr = [];
          for (const key in res.data)
            tempArr.push({ ...res.data[key], firebaseId: key });
          dispatch(setWorkouts(tempArr));
        } else if (!res.data) {
          dispatch(setWorkouts(null));
        }
      })
      .catch((err) => {
        props.toggleError();
      });
  }, [uid, accessToken, dispatch, props]);

  useEffect(() => {
    if (!initialFetchCompleted && !props.isError) {
      fetchWorkouts();
      setInitialFetchCompleted(true);
      props.setFetchCompleted();
    }
  }, [initialFetchCompleted, fetchWorkouts, props]);

  useEffect(() => {
    if (workoutDeleted) {
      fetchWorkouts();
      setWorkoutDeleted(false);
    }
  }, [workoutDeleted, fetchWorkouts]);

  const deleteWorkout = async (firebaseId) => {
    await axios
      .delete(
        `https://workout-81691-default-rtdb.firebaseio.com/workouts/${uid}/${firebaseId}.json?auth=${accessToken}`,
        { timeout: 5000 }
      )
      .then(() => setWorkoutDeleted(true))
      .catch((err) => {
        props.toggleError();
      });
  };

  const checkIfWorkoutBelongsToRoutine = (firebaseId) =>
    routines &&
    routines.filter((routine) => routine.workouts.includes(firebaseId)).length >
      0;

  const removeWorkoutFromAllRoutines = async (firebaseId) => {
    const routinesToAlter =
      routines &&
      routines.filter((routine) => routine.workouts.includes(firebaseId));

    for (let i = 0; i < routinesToAlter.length; i++) {
      const updatedWorkouts = [...routinesToAlter[i].workouts];
      updatedWorkouts[updatedWorkouts.indexOf(firebaseId)] = 'Rest';

      await axios({
        method: 'patch',
        url: `https://workout-81691-default-rtdb.firebaseio.com/routines/${user.authUser.uid}/${routinesToAlter[i].firebaseId}.json?auth=${accessToken}`,
        data: { workouts: updatedWorkouts },
        timeout: 5000,
      }).catch((err) => {
        props.toggleError();
      });
    }
  };

  const deleteWorkoutAndRemoveHandler = async (firebaseId) => {
    deleteWorkout(firebaseId);
    await removeWorkoutFromAllRoutines(firebaseId);
    dispatch(toggleRoutineRefresh());
  };

  const workoutLinks = workouts ? (
    workouts.map((workout) => (
      <WorkoutLink
        key={workout.title}
        title={workout.title}
        targetArea={workout.targetArea}
        secondaryTarget={workout.secondaryTargetArea}
        exerciseCount={workout.exercises ? workout.exercises.length : null}
        workout={workout}
        belongsToRoutine={checkIfWorkoutBelongsToRoutine(workout.firebaseId)}
        deleteWorkoutAndRemove={() =>
          deleteWorkoutAndRemoveHandler(workout.firebaseId)
        }
        deleteWorkout={() => deleteWorkout(workout.firebaseId)}
        setModalContent={(jsx) => props.setModalContent(jsx)}
        toggleModal={props.toggleModal}
      />
    ))
  ) : (
    <Link className={classes.NoWorkoutsAvailable} to="/create-workout">
      No workouts available, click here to create a workout
    </Link>
  );

  return (
    <div className={classes.Container}>
      <div className={classes.Header} onClick={props.triggerWorkoutsShowing}>
        <h3>My Workouts</h3>
        <div
          className={`${classes.Arrow} ${
            props.showWorkouts ? 'ArrowDownWhite' : 'ArrowRightWhite'
          }`}
        ></div>
      </div>
      {props.showWorkouts && workoutLinks}
    </div>
  );
};

export default Workouts;
