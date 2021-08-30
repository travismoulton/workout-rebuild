import { useState } from 'react';
import { useSelector } from 'react-redux';

import uniqid from 'uniqid';

import { selectRecordById } from '../../store/userProfileSlice';
import ExerciseListItem from './ExerciseListItem/ExerciseListItem';
import classes from './RecordedWorkoutDetail.module.css';

export default function RecordedWorkoutDetail({ location }) {
  const [axiosError, setAxiosError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        We're having trouble loading your workout. Please refresh the page or
        try again later
      </p>
    ),
  });

  const { firebaseId } = location.state;

  const workout = useSelector((state) => selectRecordById(state, firebaseId));

  const exercises = workout
    ? workout.exercises.map((exercise) => (
        <ExerciseListItem
          title={exercise.name}
          sets={exercise.sets}
          key={uniqid()}
        />
      ))
    : null;

  const display = workout ? (
    <>
      <h3 className={classes.Title}>{workout.title}</h3>
      <h4 className={classes.Date}>
        {new Date(workout.date.year, workout.date.month, workout.date.day)
          .toString()
          .substring(0, 15)}
      </h4>
      {exercises ? <ul className={classes.Exercises}>{exercises}</ul> : null}
    </>
  ) : null;

  return axiosError.isError ? axiosError.message : display;
}
