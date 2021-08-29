import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import RecordedWorkoutLink from './RecordedWorkoutLink/RecordedWorkoutLink';
import classes from '../UserProfile.module.css';
import { removeRecord, selectRecords } from '../../../store/userProfileSlice';
import { recordedWorkoutsUtils as utils } from './recordedWorkoutsUtils';

export default function RecordedWorkouts(props) {
  const { triggerRecordedWorkoutsShowing, showRecordedWorkouts } = props;

  const { uid, accessToken } = useSelector((state) => state.auth);
  const { recordedWorkouts } = useSelector(selectRecords);
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

  const deleteRecordHandler = (firebaseId) => {
    utils.deleteRecord(uid, accessToken, firebaseId);
    dispatch(removeRecord(firebaseId));
  };

  const recordedWorkoutLinks =
    recordedWorkouts &&
    recordedWorkouts.map((record) => (
      <RecordedWorkoutLink
        key={record.firebaseId}
        title={record.title}
        recordDate={record.date}
        firebaseId={record.firebaseId}
        deleteRecordedWorkout={() => deleteRecordHandler(record.firebaseId)}
      />
    ));

  return (
    <div className={classes.Container}>
      <div className={classes.Header} onClick={triggerRecordedWorkoutsShowing}>
        <h3>My Recorded Workouts</h3>
        <div
          className={`${classes.Arrow} ${
            showRecordedWorkouts ? 'ArrowDownWhite' : 'ArrowRightWhite'
          }`}
        ></div>
      </div>
      {showRecordedWorkouts && recordedWorkoutLinks}
    </div>
  );
}
