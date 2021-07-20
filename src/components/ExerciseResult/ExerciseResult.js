import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import slugify from 'slugify';

import classes from './ExerciseResult.module.css';

export default function ExerciseResult(props) {
  const { exerciseId, firebaseSearchId, custom, name, category, equipment } =
    props;

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
              id: exerciseId,
              firebaseSearchId: firebaseSearchId,
              custom: custom,
            },
          }}
        >
          <span style={{ marginRight: '.5rem' }}>Name:</span> {name}
        </Link>
      </div>
      <div>
        <span>{category && `Category: ${category}`}</span>
        <span>{equipment && `Equipment: ${equipment}`}</span>
      </div>
    </li>
  );
}