import { useDispatch } from 'react-redux';

import classes from './SetDetails.module.css';
import {
  updateExerciseData,
  removeSetFromExercise,
} from '../../store/workoutSlice';
import Input from '../../components/UI/Input/Input';

export default function SetDetails(props) {
  const { weight, reps, minutes, seconds, id, setNumber, focus, numberOfSets } =
    props;

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
        (option) => option.value === weight
      )[0];
    },
    value: weight,
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
        (option) => option.value === reps
      )[0];
    },
    value: reps,
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
        (option) => option.value === minutes
      )[0];
    },
    value: minutes,
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
        (option) => option.value === seconds
      )[0];
    },
    value: seconds,
    label: 'seconds',
    id: 4,
  };

  const setData = focus === 'reps' ? { reps, weight } : { minutes, seconds };
  const setIndex = setNumber - 1;

  const updateSetViaSelectMenu = (e, input) =>
    dispatch(
      updateExerciseData({
        id,
        setIndex,
        setData: { ...setData, [input]: e.value * 1 },
      })
    );

  const increment = (input) =>
    dispatch(
      updateExerciseData({
        id,
        setIndex,
        setData: {
          ...setData,
          [input.label]: input.value + (input.label === 'weight' ? 5 : 1),
        },
      })
    );

  const decrement = (input) => {
    if (input.value > 0)
      dispatch(
        updateExerciseData({
          id,
          setIndex,
          setData: {
            ...setData,
            [input.label]: input.value - (input.label === 'weight' ? 5 : 1),
          },
        })
      );
  };

  const formFields =
    focus === 'reps' ? [weightInput, repsInput] : [minutesInput, secondsInput];

  const form = formFields.map((field, i) => (
    <Input
      elementType={field.elementType}
      elementConfig={field.elementConfig}
      key={`${setNumber}-${field.id}-${field.label}`}
      value={field.displayValue}
      changed={(e) => updateSetViaSelectMenu(e, field.label)}
      label={field.label}
      classname="SetDetailsSelect"
      wrapperClass="SetDetailsSelectWrapper"
      SetDetails
      decrementFunction={() => decrement(field)}
      incrementFunction={() => increment(field)}
      notSearchable
      selectId={field.label}
    />
  ));

  const removeSetBtn = (
    <button
      className={`GlobalBtn-1 ${classes.Btn}`}
      onClick={() => dispatch(removeSetFromExercise({ id, setIndex }))}
    >
      Remove set
    </button>
  );

  return (
    <li className={classes.Set}>
      <p>Set # {setNumber}</p>
      <div className={classes.Form}>{form}</div>
      {numberOfSets > 1 && removeSetBtn}
    </li>
  );
}
