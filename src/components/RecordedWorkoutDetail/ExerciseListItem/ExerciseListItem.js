import uniqid from 'uniqid';

import classes from './ExerciseListItem.module.css';
import SetLevelDetails from './SetLevelDetail/SetLevelDetail';

export default function ExerciseListItem({ sets, title }) {
  const setDetails = sets.map((set, i) => (
    <SetLevelDetails
      index={i + 1}
      reps={set.reps}
      weight={set.weight}
      minutes={set.minutes}
      seconds={set.seconds}
      key={uniqid()}
    />
  ));
  return (
    <li className={classes.ListItem}>
      <p>{title}</p>
      <div className={classes.DetailRow}>
        <ul className={classes.SetDetails}>{setDetails}</ul>
      </div>
    </li>
  );
}
