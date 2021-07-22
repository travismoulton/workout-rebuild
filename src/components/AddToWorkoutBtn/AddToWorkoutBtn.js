import { useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';

import classes from './AddToWorkoutBtn.module.css';

const AddExerciseBtn = (props) => {
  const dispatch = useDispatch();
  // const addWorkoutAndRedirect = () => {
  //   dispatch(
  //     addExercise({
  //       name: props.name,
  //       id: nanoid(`${props.id}-`),
  //       sets: [{ weight: 0, reps: 1 }],
  //       focus: 'reps',
  //     })
  //   );
  //   props.history.push('/create-workout');
  // };

  return <button className={classes.Btn}>Add to workout</button>;
};

export default AddExerciseBtn;
