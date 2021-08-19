import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { createRoutineUtils as utils } from './createRoutineUtils';
import { updateObject, checkValidityHandler } from '../../shared/utility';
import Input from '../../components/UI/Input/Input';
import SubmitRoutineBtn from '../../components/SubmitRoutineBtn/SubmitRoutineBtn';
import classes from './CreateRoutine.module.css';

export default function CreateRoutine({ history }) {
  const [historyUsed, setHistoryUsed] = useState(false);
  const [selectedWorkouts, setSelectedWorkouts] = useState([
    'Rest',
    'Rest',
    'Rest',
    'Rest',
    'Rest',
    'Rest',
    'Rest',
  ]);
  const [routineNameInput, setRoutineNameInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Routine name',
    },
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    id: 'routineName',
  });
  const [workoutSelectMenu, setWorkoutSelectMenu] = useState({
    elementType: 'select',
    elementConfig: {
      options: [],
    },
    value: '',
    validation: {
      required: false,
    },
    valid: true,
  });
  const [formIsValid, setFormIsValid] = useState(false);
  const [firebaseId, setFirebaseId] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [isActiveRoutine, setIsActiveRoutine] = useState(false);
  const [error, setError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        Sorry, something went wrong. Please try refreshing the page or come back
        later
      </p>
    ),
  });

  const { user, uid, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'Create Routine';
  }, []);

  const buildWorkoutSelectMenu = useCallback(
    (data) => {
      const userWorkouts = [{ label: 'Rest', value: 'Rest' }];

      for (const key in data)
        userWorkouts.push({
          label: data[key].title,
          value: key,
        });

      setWorkoutSelectMenu({
        ...workoutSelectMenu,
        elementConfig: {
          ...workoutSelectMenu.elementConfig,
          options: userWorkouts,
        },
      });
    },
    [workoutSelectMenu]
  );

  useEffect(() => {
    const shouldBuildWorkoutSelectMenuOptions =
      user && !workoutSelectMenu.elementConfig.options.length;
    if (shouldBuildWorkoutSelectMenuOptions)
      utils
        .fetchWorkouts(uid, accessToken)
        .then(({ data }) => buildWorkoutSelectMenu(data))
        .catch((err) => {
          setError({ ...error, isError: true });
        });
  }, [
    accessToken,
    uid,
    workoutSelectMenu,
    error,
    user,
    buildWorkoutSelectMenu,
  ]);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  useEffect(() => {
    const shouldLoadRoutineData = history.location.state && !historyUsed;
    if (shouldLoadRoutineData) {
      const { routine } = history.location.state;

      if (routine) {
        setSelectedWorkouts(routine.workouts);
        setRoutineNameInput({ ...routineNameInput, value: routine.title });
        setOriginalTitle(routine.title);
        setFirebaseId(routine.firebaseId);
        setHistoryUsed(true);
        setFormIsValid(true);
        setIsActiveRoutine(routine.activeRoutine);
      }
    }
  }, [
    history.location.state,
    historyUsed,
    selectedWorkouts,
    routineNameInput,
    formIsValid,
    firebaseId,
  ]);

  const workoutSelectMenus = days.map((day, i) => {
    const select = {
      ...workoutSelectMenu,
      value: workoutSelectMenu.elementConfig.options.filter(
        (option) => option.value === selectedWorkouts[i]
      ),
    };
    const changed = (e) => {
      const tempWorkouts = [...selectedWorkouts];
      tempWorkouts[i] = e.value;
      setSelectedWorkouts(tempWorkouts);
    };
    return (
      <Input
        elementType={select.elementType}
        elementConfig={select.elementConfig}
        value={select.value}
        changed={(e) => changed(e)}
        label={day}
        key={day}
        classname="RoutineSelect"
        wrapperClass="RoutineSelectWrapper"
      />
    );
  });

  const inputChangedHandler = (e, input) => {
    const updatedInput = updateObject(input, {
      value: e.target.value,
      valid: checkValidityHandler(e.target.value, input.validation),
      touched: true,
    });

    updatedInput.valid ? setFormIsValid(true) : setFormIsValid(false);

    setRoutineNameInput(updatedInput);
  };

  // Preventing submission of a routine that has no workouts.
  const checkForWorkouts = () => {
    let hasWorkout = false;

    selectedWorkouts.forEach((workout) => {
      if (workout !== 'Rest') hasWorkout = true;
    });

    return hasWorkout;
  };

  const display = (
    <>
      <h1 className={classes.H1}>Create a new routine</h1>
      <Input
        elementType={routineNameInput.elementType}
        elementConfig={routineNameInput.elementConfig}
        value={routineNameInput.value}
        changed={(e) => inputChangedHandler(e, routineNameInput)}
        classname="RoutineName"
      />
      {workoutSelectMenus}
      <SubmitRoutineBtn
        title={routineNameInput.value}
        workouts={selectedWorkouts}
        history={history}
        valid={formIsValid}
        containsWorkout={() => checkForWorkouts()}
        shouldCreateNewRoutine={firebaseId === ''}
        firebaseId={firebaseId}
        isActiveRoutine={isActiveRoutine}
        titleChanged={routineNameInput.touched}
        originalTitleEntact={originalTitle === routineNameInput.value}
      />
    </>
  );

  return error.isError
    ? error.message
    : workoutSelectMenu.elementConfig.options.length
    ? display
    : null;
}
