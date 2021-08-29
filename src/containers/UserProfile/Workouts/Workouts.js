import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import WorkoutLink from './WorkoutLink/WorkoutLink';
import classes from '../UserProfile.module.css';
import { workoutsUtils as utils } from './workoutsUtils';
import {
  selectWorkouts,
  selectRoutines,
  removeWorkout,
  clearRoutines,
  fetchRoutines,
} from '../../../store/userProfileSlice';

export default function Workouts(props) {
  const {
    toggleError,
    setModalContent,
    toggleModal,
    triggerWorkoutsShowing,
    showWorkouts,
  } = props;

  const { uid, accessToken } = useSelector((state) => state.auth);
  const routines = useSelector(selectRoutines);
  const workouts = useSelector(selectWorkouts);

  const dispatch = useDispatch();

  const { deleteWorkout, removeWorkoutFromRoutine } = utils;

  const deleteWorkoutHandler = (firebaseId) => {
    deleteWorkout(uid, accessToken, firebaseId);
    dispatch(removeWorkout(firebaseId));
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

      const routineData = { ...routinesToAlter[i], workouts: updatedWorkouts };

      await removeWorkoutFromRoutine(
        uid,
        accessToken,
        firebaseId,
        routineData
      ).catch(() => toggleError());
    }
  };

  const refreshRoutines = () => {
    dispatch(clearRoutines());
    dispatch(fetchRoutines({ uid, accessToken }));
  };

  const deleteWorkoutAndRemoveHandler = async (firebaseId) => {
    deleteWorkoutHandler(firebaseId);
    await removeWorkoutFromAllRoutines(firebaseId);
    refreshRoutines();
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
        deleteWorkout={() => deleteWorkoutHandler(workout.firebaseId)}
        setModalContent={(jsx) => setModalContent(jsx)}
        toggleModal={toggleModal}
      />
    ))
  ) : (
    <Link className={classes.NoWorkoutsAvailable} to="/create-workout">
      No workouts available, click here to create a workout
    </Link>
  );

  return (
    <div className={classes.Container}>
      <div className={classes.Header} onClick={triggerWorkoutsShowing}>
        <h3>My Workouts</h3>
        <div
          className={`${classes.Arrow} ${
            showWorkouts ? 'ArrowDownWhite' : 'ArrowRightWhite'
          }`}
        ></div>
      </div>
      {showWorkouts && workoutLinks}
    </div>
  );
}
