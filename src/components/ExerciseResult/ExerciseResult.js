import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import slugify from 'slugify';

import AddToWorkoutBtn from '../AddToWorkoutBtn/AddToWorkoutBtn';
import FavoriteBtn from '../FavoriteBtn/FavoriteBtn';
import classes from './ExerciseResult.module.css';

export default function ExerciseResult(props) {
  const { exerciseId, firebaseSearchId, isCustom, name, category, equipment } =
    props;

  const { user } = useSelector((state) => state.auth);
  const { buildingWorkout } = useSelector((state) => state.workout);

  return (
    <li
      className={classes.ExerciseResult}
      data-testid={`ExerciseResult__${name}`}
    >
      <div style={{ marginBottom: '0.5rem' }}>
        <Link
          to={{
            pathname: `/exercise/${slugify(name)}`,
            state: {
              exerciseId: exerciseId,
              firebaseSearchId: firebaseSearchId,
              isCustom: isCustom,
            },
          }}
        >
          <span style={{ marginRight: '.5rem' }}>Name:</span> {name}
        </Link>
        <div className={classes.BtnPairContainer}>
          {user && <FavoriteBtn exerciseId={exerciseId} />}
          {buildingWorkout && <AddToWorkoutBtn name={name} id={exerciseId} />}
        </div>
      </div>

      <div>
        <span>{category && `Category: ${category}`}</span>
        <span>{equipment && `Equipment: ${equipment}`}</span>
      </div>
    </li>
  );
}
