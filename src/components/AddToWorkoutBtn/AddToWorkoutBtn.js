import { useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import { useHistory } from 'react-router-dom';

import { addExercise } from '../../store/workoutSlice';
import classes from './AddToWorkoutBtn.module.css';

export default function AddExerciseBtn({ name, id }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const addWorkoutAndRedirect = () => {
    dispatch(
      addExercise({
        name,
        id: `${id}-${nanoid()}`,
        sets: [{ weight: 0, reps: 0 }],
        focus: 'reps',
      })
    );
    history.push('/create-workout');
  };

  return (
    <button onClick={addWorkoutAndRedirect} className={classes.Btn}>
      Add to workout
    </button>
  );
}
