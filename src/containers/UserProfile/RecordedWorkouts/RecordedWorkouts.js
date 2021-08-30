import { useSelector, useDispatch } from 'react-redux';

import RecordedWorkoutLink from './RecordedWorkoutLink/RecordedWorkoutLink';
import classes from '../UserProfile.module.css';
import { removeRecord, selectRecords } from '../../../store/userProfileSlice';
import { recordedWorkoutsUtils as utils } from './recordedWorkoutsUtils';

export default function RecordedWorkouts(props) {
  const { triggerRecordedWorkoutsShowing, showRecordedWorkouts } = props;

  const { uid, accessToken } = useSelector((state) => state.auth);
  const recordedWorkouts = useSelector(selectRecords);
  const dispatch = useDispatch();

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
