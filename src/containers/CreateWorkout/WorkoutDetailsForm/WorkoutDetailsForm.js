import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../../components/UI/Input/Input';
import {
  setFormData,
  setExercises,
  setEntireForm,
  resetWorkoutStore,
  setFirebaseId,
} from '../../../store/actions';
import { updateObject, checkValidityHandler } from '../../../shared/utility';

const WorkoutDetailsForm = (props) => {
  const { formData } = useSelector((state) => state.workout);
  const dispatch = useDispatch();

  const [workoutNameInput, setWorkoutNameInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Workout name...',
    },
    value: formData.workoutName,
    validation: {
      required: true,
    },
    valid: formData.workoutName ? true : false,
    touched: false,
    id: 'workoutName',
    className: 'WorkoutName',
  });

  const [targetAreaInput, setTargetAreaInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: [
        { value: 0, label: '' },
        { value: 10, label: 'Abs' },
        { value: 8, label: 'Arms' },
        { value: 12, label: 'Back' },
        { value: 14, label: 'Calves' },
        { value: 11, label: 'Chest' },
        { value: 9, label: 'Legs' },
        { value: 13, label: 'Shoulders' },
        { value: 1, label: 'All Body' },
      ],
    },
    value: formData.targetArea,
    label: 'Target Muscle Area',
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    id: 'targetArea',
    className: 'CreateWorkoutSelect',
    wrapperClass: 'WorkoutDetailsSelectWrapper',
  });

  const [secondaryTargetAreaInput, setSecondaryTargetAreaInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: [
        { value: 0, label: '' },
        { value: 10, label: 'Abs' },
        { value: 8, label: 'Arms' },
        { value: 12, label: 'Back' },
        { value: 14, label: 'Calves' },
        { value: 11, label: 'Chest' },
        { value: 9, label: 'Legs' },
        { value: 13, label: 'Shoulders' },
      ],
    },
    value: formData.secondaryTarget,
    label: ' Secondary Target',
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    id: 'secondaryTarget',
    className: 'CreateWorkoutSelect',
    wrapperClass: 'WorkoutDetailsSelectWrapper',
  });

  useEffect(() => {
    if (props.shouldLoadWorkoutData) {
      const { workout } = props.history.location.state;

      if (workout) {
        console.log(workout);
        dispatch(setExercises(workout.exercises));
        dispatch(
          setEntireForm(
            workout.title,
            workout.targetArea,
            workout.secondaryTargetArea
          )
        );

        if (workout.title)
          setWorkoutNameInput({ ...workoutNameInput, value: workout.title });

        if (workout.targetAreaCode)
          setTargetAreaInput({
            ...targetAreaInput,
            value: targetAreaInput.elementConfig.options.filter(
              (option) => option.value === workout.targetAreaCode
            )[0],
          });

        if (workout.secondaryTargetCode)
          setSecondaryTargetAreaInput({
            ...secondaryTargetAreaInput,
            value: secondaryTargetAreaInput.elementConfig.options.filter(
              (option) => option.value === workout.secondaryTargetCode
            )[0],
          });

        props.setOriginalTitle(workout.title);
        props.setFormIsValid(true);
        props.setShouldLoadWorkoutDataToFalse();
        dispatch(setFirebaseId(workout.firebaseId));
      }
    }
  }, [
    props,
    dispatch,
    secondaryTargetAreaInput,
    targetAreaInput,
    workoutNameInput,
  ]);

  const formFields = [
    workoutNameInput,
    targetAreaInput,
    secondaryTargetAreaInput,
  ];

  const inputChangedHandler = useCallback(
    (e, input) => {
      if (e.target) e.value = e.target.value;
      const updatedInput = updateObject(input, {
        value:
          input === workoutNameInput
            ? e.value
            : input.elementConfig.options.filter(
                (option) => option.value === e.value
              )[0],
        valid: checkValidityHandler(e.value, input.validation),
        touched: true,
      });

      if (input.id === 'workoutName') props.setFormIsValid(updatedInput.valid);

      input.id === 'workoutName'
        ? setWorkoutNameInput(updatedInput)
        : input.id === 'targetArea'
        ? setTargetAreaInput(updatedInput)
        : setSecondaryTargetAreaInput(updatedInput);

      dispatch(setFormData(formData, input.id, e.value));
    },
    [dispatch, formData, props, workoutNameInput]
  );

  const detailsForm = formFields.map((field) => (
    <Input
      elementType={field.elementType}
      elementConfig={field.elementConfig}
      key={field.id}
      value={field.value}
      changed={(e) => inputChangedHandler(e, field)}
      label={field.label}
      touched={field.touched}
      invalid={!field.valid}
      classname={field.className}
      wrapperClass={field.wrapperClass}
    />
  ));

  const setInputAsTouched = useCallback(() => {
    setWorkoutNameInput({ ...workoutNameInput, touched: true });
  }, [workoutNameInput]);

  const clearAllFormInputs = useCallback(() => {
    setWorkoutNameInput({ ...workoutNameInput, value: '' });
    setTargetAreaInput({ ...targetAreaInput, value: null });
    setSecondaryTargetAreaInput({ ...secondaryTargetAreaInput, value: null });
  }, [secondaryTargetAreaInput, workoutNameInput, targetAreaInput]);

  const clearAllWorkoutData = useCallback(() => {
    clearAllFormInputs();
    dispatch(resetWorkoutStore());
  }, [clearAllFormInputs, dispatch]);

  useEffect(() => {
    if (props.shouldSetInputAsTouched) {
      setInputAsTouched(true);
      props.shouldSetInputAsTouchedToFalse();
    }
  }, [props, setInputAsTouched]);

  useEffect(() => {
    if (props.shouldClearFormInputs) {
      clearAllWorkoutData();
      props.setShouldClearFormInputsToFalse();
    }
  }, [props, clearAllWorkoutData]);

  return detailsForm;
};

export default WorkoutDetailsForm;
