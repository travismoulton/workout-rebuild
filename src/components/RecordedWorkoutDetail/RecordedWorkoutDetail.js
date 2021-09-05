import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import uniqid from 'uniqid';

import { selectRecordById } from '../../store/userProfileSlice';
import ExerciseListItem from './ExerciseListItem/ExerciseListItem';
import classes from './RecordedWorkoutDetail.module.css';

export default function RecordedWorkoutDetail({ location }) {
  useEffect(() => {
    document.title = 'View workout';
  }, []);

  const { firebaseId } = location.state;

  const workout = useSelector((state) => selectRecordById(state, firebaseId));

  const errorMsg = (
    <p style={{ color: 'red' }}>
      We're having trouble loading your workout. Please refresh the page or try
      again later
    </p>
  );

  if (!workout) return errorMsg;

  const exercises = workout
    ? workout.exercises.map((exercise) => (
        <ExerciseListItem
          title={exercise.name}
          sets={exercise.sets}
          key={uniqid()}
        />
      ))
    : null;

  return (
    <>
      <h3 className={classes.Title}>{workout.title}</h3>
      <h4 className={classes.Date}>
        {new Date(workout.date.year, workout.date.month, workout.date.day)
          .toString()
          .substring(0, 15)}
      </h4>
      {exercises && (
        <ul data-testid="Exercises" className={classes.Exercises}>
          {exercises}
        </ul>
      )}
    </>
  );
}
