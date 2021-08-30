import { Link } from 'react-router-dom';

import classes from '../../UserProfile.module.css';

export default function RecordedWorkoutLink(props) {
  const { title, recordDate, firebaseId, deleteRecordedWorkout } = props;

  const date = new Date(recordDate.year, recordDate.month, recordDate.day);

  return (
    <>
      <div className={classes.Record}>
        <p>{title}</p>
        <p>{date.toString().substring(0, 15)}</p>
        <div className={classes.FlexRow}>
          <Link
            to={{
              pathname: `/recorded-workout-detail/${firebaseId}`,
              state: { firebaseId },
            }}
          >
            <button className={`GlobalBtn-2 ${classes.Btn}`}>
              View details
            </button>
          </Link>
          <button
            className={`GlobalBtn-2 ${classes.Btn}`}
            onClick={deleteRecordedWorkout}
          >
            Delete this record
          </button>
        </div>
      </div>
    </>
  );
}
