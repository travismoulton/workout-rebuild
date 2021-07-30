import { useSelector, useDispatch } from 'react-redux';

import classes from './SetDetails.module.css';
import {
  updateExerciseData,
  removeSetFromExercise,
  selectAllWorkouts,
} from '../../store/workoutSlice';
import Input from '../../components/UI/Input/Input';

const SetDetails = (props) => {
  const exercises = useSelector((state) => selectAllWorkouts(state));
  const dispatch = useDispatch();

  const weightInput = {
    elementType: 'select',
    elementConfig: {
      options: (() => {
        let arr = [];
        for (let i = 0; i < 75; i++)
          arr.push({ value: i * 5, label: (i * 5).toString() });
        return arr;
      })(),
    },
    get displayValue() {
      return this.elementConfig.options.filter(
        (option) => option.value === props.weight
      )[0];
    },
    value: props.weight,
    label: 'weight',
    id: 1,
  };

  const repsInput = {
    elementType: 'select',
    elementConfig: {
      options: (() => {
        let arr = [];
        for (let i = 0; i < 25; i++)
          arr.push({ value: i, label: i.toString() });
        return arr;
      })(),
    },
    get displayValue() {
      return this.elementConfig.options.filter(
        (option) => option.value === props.reps
      )[0];
    },
    value: props.reps,
    label: 'reps',
    id: 3,
  };

  const minutesInput = {
    elementType: 'select',
    elementConfig: {
      options: (() => {
        let arr = [];
        for (let i = 0; i < 90; i++)
          arr.push({ value: i, label: i.toString() });
        return arr;
      })(),
    },
    get displayValue() {
      return this.elementConfig.options.filter(
        (option) => option.value === props.minutes
      )[0];
    },
    value: props.minutes,
    label: 'minutes',
    id: 3,
  };

  const secondsInput = {
    elementType: 'select',
    elementConfig: {
      options: (() => {
        let arr = [];
        for (let i = 0; i < 61; i++)
          arr.push({ value: i, label: i.toString() });
        return arr;
      })(),
    },
    get displayValue() {
      return this.elementConfig.options.filter(
        (option) => option.value === props.seconds
      )[0];
    },
    value: props.seconds,
    label: 'seconds',
    id: 4,
  };

  const updateSetViaSelectMenu = (e, input) => {
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        input,
        e.value * 1,
        props.setNumber - 1
      )
    );
  };

  const increment = (input) => {
    dispatch(
      updateExerciseData(
        exercises,
        props.id,
        input.label,
        input.value + (input.label === 'weight' ? 5 : 1),
        props.setNumber - 1
      )
    );
  };

  const decrement = (input) => {
    if (input.value > 0)
      dispatch(
        updateExerciseData(
          exercises,
          props.id,
          input.label,
          input.value - (input.label === 'weight' ? 5 : 1),
          props.setNumber - 1
        )
      );
  };

  const formFields =
    props.focus === 'reps'
      ? [weightInput, repsInput]
      : [minutesInput, secondsInput];

  const form = formFields.map((field, i) => (
    <Input
      elementType={field.elementType}
      elementConfig={field.elementConfig}
      key={field.id}
      value={field.displayValue}
      changed={(e) => updateSetViaSelectMenu(e, field.label)}
      label={field.label}
      classname="SetDetailsSelect"
      wrapperClass="SetDetailsSelectWrapper"
      setClipPath
      SetDetails
      decrementFunction={() => decrement(field)}
      incrementFunction={() => increment(field)}
      notSearchable
    />
  ));

  const removeSetBtn = (
    <button
      className={`GlobalBtn-1 ${classes.Btn}`}
      onClick={() =>
        dispatch(
          removeSetFromExercise(exercises, props.id, props.setNumber - 1)
        )
      }
    >
      Remove set
    </button>
  );

  return (
    <li className={classes.Set}>
      <p>Set # {props.setNumber}</p>
      <div className={classes.Form}>{form}</div>
      {props.numberOfSets > 1 && removeSetBtn}
    </li>
  );
};

export default SetDetails;
