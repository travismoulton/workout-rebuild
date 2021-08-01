import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs';

import RemoveExerciseBtn from './RemoveExerciseBtn/RemoveExerciseBtn';
import SetDetails from '../SetDetails/SetDetails';
import Input from '../../components/UI/Input/Input';
import {
  changeExerciseOrder,
  addSetToExercise,
  resetExerciseFocus,
} from '../../store/workoutSlice';
import classes from './WorkoutListItem.module.css';

export default function WorkoutListItem(props) {
  const {
    focus,
    id,
    sets,
    isFirstExercise,
    isLastExercise,
    inRecordMode,
    name,
  } = props;

  const [exerciseFocus, setExerciseFocus] = useState(focus || 'reps');
  const { exercises } = useSelector((state) => state.workout);
  const dispatch = useDispatch();

  const [exerciseFocusInput, setExerciseFocusInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: [
        { value: 'reps', label: 'Reps' },
        { value: 'time', label: 'Time' },
      ],
    },
    value: { value: 'reps', label: 'Reps' },
    label: 'Exercise focus:',
    id: 1,
  });

  const changeFocusHandler = (e) => {
    setExerciseFocusInput({
      ...exerciseFocusInput,
      value: exerciseFocusInput.elementConfig.options.filter(
        (option) => option.value === e.value
      )[0],
    });
    setExerciseFocus(e.value);

    e.value === 'time'
      ? dispatch(resetExerciseFocus({ id, focus: e.value }))
      : dispatch(resetExerciseFocus({ id, focus: e.value }));
  };

  const focusSelectMenu = (
    <Input
      elementConfig={exerciseFocusInput.elementConfig}
      elementType={exerciseFocusInput.elementType}
      changed={changeFocusHandler}
      label={exerciseFocusInput.label}
      classname={'ExerciseFocusSelect'}
      wrapperClass={'ExerciseFocusSelectWrapper'}
      value={exerciseFocusInput.value}
      notSearchable
    />
  );

  const moveUpInOrderBtn = (
    <button
      className={`GlobalBtn-1 ${classes.OrderBtn}`}
      onClick={() => dispatch(changeExerciseOrder(exercises, id, 'up'))}
    >
      Move Exercise Up <BsArrowUpShort size="2em" color="#fff" />
    </button>
  );

  const moveDownInOrderBtn = (
    <button
      className={`GlobalBtn-1 ${classes.OrderBtn}`}
      onClick={() => dispatch(changeExerciseOrder(exercises, id, 'down'))}
    >
      Move Exercise Down <BsArrowDownShort size="2em" color="#fff" />
    </button>
  );

  const addSet = () =>
    exerciseFocus === 'reps'
      ? dispatch(addSetToExercise({ id }))
      : dispatch(addSetToExercise({ id }));

  const addSetBtn = (
    <button className={`GlobalBtn-1 ${classes.AddSetBtn}`} onClick={addSet}>
      Add another set
    </button>
  );

  const setListItems =
    sets.length &&
    sets.map((set, i) => (
      <SetDetails
        key={`${id}#${i + 1}`}
        reps={set.reps}
        weight={set.weight}
        minutes={set.minutes}
        seconds={set.seconds}
        focus={exerciseFocus}
        id={id}
        setNumber={i + 1}
        numberOfSets={sets.length}
      />
    ));

  return (
    <li className={classes.WorkoutListItem}>
      <div className={classes.WorkoutTitle}>{name}</div>
      {focusSelectMenu}
      {setListItems && <ul className={classes.SetsWrapper}>{setListItems}</ul>}
      <div className={classes.BtnRow}>
        {!isFirstExercise && !inRecordMode && moveUpInOrderBtn}
        {addSetBtn}
        {!isLastExercise && !inRecordMode && moveDownInOrderBtn}
      </div>
      <RemoveExerciseBtn id={id} exerciseName={name} />
    </li>
  );
}
