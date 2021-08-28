import { Link } from 'react-router-dom';

import classes from '../../UserProfile.module.css';

const RecordedWorkoutLink = (props) => {
  const date = new Date(props.date.year, props.date.month, props.date.day);

  return (
    <>
      <div className={classes.Record}>
        <p>{props.title}</p>
        <p>{date.toString().substring(0, 15)}</p>
        <div className={classes.FlexRow}>
          <Link to={`/recorded-workout-detail/${props.firebaseId}`}>
            <button className={`GlobalBtn-2 ${classes.Btn}`}>
              View details
            </button>
          </Link>
          <button
            className={`GlobalBtn-2 ${classes.Btn}`}
            onClick={props.deleteRecordedWorkout}
          >
            Delete this record
          </button>
        </div>
      </div>
    </>
  );
};

export default RecordedWorkoutLink;
