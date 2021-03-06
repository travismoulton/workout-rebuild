import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../../components/UI/Input/Input';
import {
  setFormData,
  resetWorkoutStore,
  clearExercises,
} from '../../../store/workoutSlice';
import { updateObject, checkValidityHandler } from '../../../shared/utility';

export default function WorkoutDetailsForm(props) {
  const {
    shouldClearFormInputs,
    shouldSetInputAsTouched,
    shouldSetInputAsTouchedToFalse,
    setShouldClearFormInputsToFalse,
    setFormIsValid,
  } = props;

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
    wrapperClass: 'WorkoutNameWrapper',
    label: 'Workout Name',
  });

  const targetAreaSelectOptions = [
    { value: 0, label: '' },
    { value: 10, label: 'Abs' },
    { value: 8, label: 'Arms' },
    { value: 12, label: 'Back' },
    { value: 14, label: 'Calves' },
    { value: 11, label: 'Chest' },
    { value: 9, label: 'Legs' },
    { value: 13, label: 'Shoulders' },
    { value: 1, label: 'All Body' },
  ];

  const [targetAreaInput, setTargetAreaInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: targetAreaSelectOptions,
    },
    value: formData.targetArea,
    label: 'Target Muscle Area',
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    id: 'targetArea',
    selectId: 'targetArea',
    className: 'CreateWorkoutSelect',
    wrapperClass: 'WorkoutDetailsSelectWrapper',
  });

  const [secondaryTargetAreaInput, setSecondaryTargetAreaInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: targetAreaSelectOptions,
    },
    value: formData.secondaryTarget,
    label: ' Secondary Target',
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    id: 'secondaryTarget',
    selectId: 'secondaryTarget',
    className: 'CreateWorkoutSelect',
    wrapperClass: 'WorkoutDetailsSelectWrapper',
  });

  const formFields = [
    workoutNameInput,
    targetAreaInput,
    secondaryTargetAreaInput,
  ];

  const inputChangedHandler = useCallback(
    (e, input) => {
      if (e.target) e.value = e.target.value;

      const updatedValue =
        input === workoutNameInput
          ? e.value
          : input.elementConfig.options.filter(
              (option) => option.value === e.value
            )[0];

      const updatedInput = updateObject(input, {
        value: updatedValue,
        valid: checkValidityHandler(e.value, input.validation),
        touched: true,
      });

      if (input.id === 'workoutName') setFormIsValid(updatedInput.valid);

      input.id === 'workoutName'
        ? setWorkoutNameInput(updatedInput)
        : input.id === 'targetArea'
        ? setTargetAreaInput(updatedInput)
        : setSecondaryTargetAreaInput(updatedInput);

      const formData = {
        workoutName: workoutNameInput.value,
        targetArea: targetAreaInput.value,
        secondaryTarget: secondaryTargetAreaInput.value,
        [input.id]: updatedValue,
      };

      dispatch(setFormData(formData));
    },
    [
      dispatch,
      setFormIsValid,
      workoutNameInput,
      targetAreaInput,
      secondaryTargetAreaInput,
    ]
  );

  const detailsForm = formFields.map((field) => (
    <Input
      elementType={field.elementType}
      elementConfig={field.elementConfig}
      key={field.id}
      value={field.value}
      changed={(e) => inputChangedHandler(e, field)}
      label={field.label}
      id={field.id}
      touched={field.touched}
      invalid={!field.valid}
      classname={field.className}
      wrapperClass={field.wrapperClass}
      selectId={field.selectId}
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
    dispatch(clearExercises());
  }, [clearAllFormInputs, dispatch]);

  useEffect(() => {
    if (shouldSetInputAsTouched) {
      setInputAsTouched(true);
      shouldSetInputAsTouchedToFalse();
    }
  }, [
    shouldSetInputAsTouchedToFalse,
    shouldSetInputAsTouched,
    setInputAsTouched,
  ]);

  useEffect(() => {
    if (shouldClearFormInputs) {
      clearAllWorkoutData();
      setShouldClearFormInputsToFalse();
    }
  }, [
    shouldClearFormInputs,
    setShouldClearFormInputsToFalse,
    clearAllWorkoutData,
  ]);

  return detailsForm;
}
