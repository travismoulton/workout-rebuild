import classes from './SetLevelDetail.module.css';

const SetLevelDetail = ({ index, reps, minutes, weight, seconds }) => (
  <li className={classes.Container}>
    <p>Set #{index}</p>
    <div className={classes.Details}>
      {reps !== undefined ? <p>Reps: {reps}</p> : <p>Minutes: {minutes}</p>}
      {weight !== undefined ? (
        <p>Weight: {weight}</p>
      ) : (
        <p>Seconds: {seconds}</p>
      )}
    </div>
  </li>
);

export default SetLevelDetail;
