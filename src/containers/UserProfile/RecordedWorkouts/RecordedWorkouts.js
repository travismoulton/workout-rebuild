import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import RecordedWorkoutLink from './RecordedWorkoutLink/RecordedWorkoutLink';
import classes from '../UserProfile.module.css';
import { setRecordedWorkouts } from '../../../store/actions';

const RecordedWorkouts = (props) => {
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);
  const [recordedWorkoutDeleted, setRecordedWorkoutDeleted] = useState(false);
  const { uid, accessToken } = useSelector((state) => state.auth);
  const { recordedWorkouts } = useSelector((state) => state.userProfile);
  const dispatch = useDispatch();

  const bubbleSortWorkoutDates = useCallback((unsortedDates) => {
    const dates = [...unsortedDates];
    const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]]);

    for (let i = 0; i < dates.length; i++) {
      let isSwapped = false;
      for (let j = 0; j < dates.length - 1; j++) {
        if (
          new Date(
            dates[j + 1].date.year,
            dates[j + 1].date.month,
            dates[j + 1].date.day
          ) >
          new Date(dates[j].date.year, dates[j].date.month, dates[j].date.day)
        ) {
          swap(dates, j, j + 1);
          isSwapped = true;
        }
      }
      if (!isSwapped) break;
    }
    return dates;
  }, []);

  const fetchRecordedWorkouts = useCallback(() => {
    axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/recordedWorkouts/${uid}.json?auth=${accessToken}`,
        { timeout: 5000 }
      )
      .then((res) => {
        if (res.data) {
          const tempArr = [];
          for (const key in res.data) {
            tempArr.push({ ...res.data[key], firebaseId: key });
          }
          dispatch(setRecordedWorkouts(bubbleSortWorkoutDates(tempArr)));
        } else if (!res.data) {
          dispatch(setRecordedWorkouts(null));
        }
      })
      .catch((err) => {
        props.toggleError();
      });
  }, [uid, accessToken, bubbleSortWorkoutDates, dispatch, props]);

  useEffect(() => {
    if (!initialFetchCompleted && !props.isError) {
      fetchRecordedWorkouts();
      setInitialFetchCompleted(true);
      props.setFetchCompleted();
    }
  }, [initialFetchCompleted, fetchRecordedWorkouts, props]);

  const deleteRecordedWorkout = async (firebaseId) => {
    await axios
      .delete(
        `https://workout-81691-default-rtdb.firebaseio.com/recordedWorkouts/${uid}/${firebaseId}.json?auth=${accessToken}`,
        { timeout: 5000 }
      )
      .then(() => {
        setRecordedWorkoutDeleted(true);
      })
      .catch((err) => {
        props.toggleError();
      });
  };

  useEffect(() => {
    if (recordedWorkoutDeleted) {
      fetchRecordedWorkouts();
      setRecordedWorkoutDeleted(false);
    }
  }, [fetchRecordedWorkouts, recordedWorkoutDeleted]);

  const recordedWorkoutLinks =
    recordedWorkouts &&
    recordedWorkouts.map((record) => (
      <RecordedWorkoutLink
        key={record.firebaseId}
        title={record.title}
        date={record.date}
        firebaseId={record.firebaseId}
        deleteRecordedWorkout={() => deleteRecordedWorkout(record.firebaseId)}
      />
    ));

  return (
    <div className={classes.Container}>
      <div
        className={classes.Header}
        onClick={props.triggerRecordedWorkoutsShowing}
      >
        <h3>My Recorded Workouts</h3>
        <div
          className={`${classes.Arrow} ${
            props.showRecordedWorkouts ? 'ArrowDownWhite' : 'ArrowRightWhite'
          }`}
        ></div>
      </div>
      {props.showRecordedWorkouts && recordedWorkoutLinks}
    </div>
  );
};

export default RecordedWorkouts;
