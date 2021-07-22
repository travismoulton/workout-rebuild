import { GiMuscleUp } from 'react-icons/gi';

import classes from '../ExerciseDetail.module.css';

export default function ExerciseDetailMuscles({ muscles, secondary }) {
  const primaryMuscles = muscles.map((muscle) =>
    muscle ? <li key={muscle.name}>{muscle.name}</li> : null
  );
  const secondaryMuscles = secondary.map((muscle) =>
    muscle ? <li key={muscle.name}>{muscle.name}</li> : null
  );

  const displayMuscles = primaryMuscles.length || secondaryMuscles.length;

  return displayMuscles ? (
    <div className={`${classes.Detail} ${classes.Muscle}`}>
      {primaryMuscles.length ? (
        <>
          <h3>
            Primary Muscles <GiMuscleUp />
          </h3>
          <ul data-testid="primaryMuscleList">{primaryMuscles}</ul>
        </>
      ) : null}
      {secondaryMuscles.length ? (
        <>
          <h3>
            Secondary Muscles <GiMuscleUp />
          </h3>
          <ul data-testid="secondaryMuscleList">{secondaryMuscles}</ul>
        </>
      ) : null}
    </div>
  ) : (
    <></>
  );
}
