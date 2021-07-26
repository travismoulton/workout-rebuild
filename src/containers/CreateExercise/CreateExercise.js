import { useState, useEffect } from 'react';

import Input from '../../components/UI/Input/Input';
import SubmitExerciseBtn from './SubmitExerciseBtn/SubmitExerciseBtn';
import { updateObject, checkValidityHandler } from '../../shared/utility';
import { createExerciseUtils as utils, templates } from './createExerciseUtils';
import wgerData from '../../shared/wgerData';
import classes from './CreateExercise.module.css';

export default function CreateExercise() {
  const [formIsValid, setFormIsValid] = useState(false);
  const [requiredEquipmentList, setRequiredEquipmentList] = useState({
    ...templates.requiredEquipmentList,
  });
  const [exerciseNameInput, setExerciseNameInput] = useState({
    ...templates.exerciseName,
  });
  const [descriptionInput, setDescriptionInput] = useState({
    ...templates.description,
  });
  const [categoryInput, setCategoryInput] = useState({
    ...templates.category,
  });

  const [primaryMusclesUsed, setPrimaryMusclesUsed] = useState(null);
  const [secondaryMusclesUsed, setSecondaryMusclesUsed] = useState(null);

  const formFields = [exerciseNameInput, descriptionInput, categoryInput];

  useEffect(() => {
    document.title = 'Create Custom Exercise';
  }, []);

  const equipmentCheckboxes = utils.getEquipment().map((equip) => {
    const checkbox = { ...templates.checkBox, label: equip.name };

    const changed = (equipmentCode) =>
      setRequiredEquipmentList((prevEquipment) => ({
        ...prevEquipment,
        [equipmentCode]: {
          ...prevEquipment[equipmentCode],
          checked: !prevEquipment[equipmentCode].checked,
        },
      }));
    return (
      <Input
        elementType={checkbox.elementType}
        elementConfig={checkbox.elementConfig}
        value={checkbox.value}
        label={checkbox.label}
        key={checkbox.label}
        changed={() => changed(equip.code)}
      />
    );
  });

  function generateMuscleCheckboxes(muscleGroup) {
    const setMuscleState = (muscleCode, prevMuscle) => ({
      ...prevMuscle,
      [muscleCode]: {
        ...prevMuscle[muscleCode],
        checked: !prevMuscle[muscleCode].checked,
      },
    });

    const changed = (muscleCode, muscleGroup) => {
      if (muscleGroup === 'primary')
        setPrimaryMusclesUsed((prevMuscle) =>
          setMuscleState(muscleCode, prevMuscle)
        );

      if (muscleGroup === 'secondary')
        setSecondaryMusclesUsed((prevMuscle) =>
          setMuscleState(muscleCode, prevMuscle)
        );
    };

    return utils.getMuscles().map((muscle) => {
      const checkbox = { ...templates.checkBox, label: muscle.name };

      return (
        <Input
          elementType={checkbox.elementType}
          elementConfig={checkbox.elementConfig}
          value={checkbox.value}
          label={checkbox.label}
          key={checkbox.label}
          changed={() => changed(muscle.code, muscleGroup)}
        />
      );
    });
  }

  useEffect(() => {
    if (!secondaryMusclesUsed && !primaryMusclesUsed) {
      const muscles = {};
      for (const key in wgerData.muscles) {
        muscles[key] = { name: wgerData.muscles[key].name, checked: false };
      }
      setSecondaryMusclesUsed(muscles);
      setPrimaryMusclesUsed(muscles);
    }
  }, [secondaryMusclesUsed, primaryMusclesUsed]);

  const checkFormValidity = (updatedInput) => {
    if (updatedInput.id === 'name') {
      setFormIsValid(updatedInput.valid && categoryInput.valid);
    } else if (updatedInput.id === 'category') {
      setFormIsValid(updatedInput.valid && exerciseNameInput.valid);
    }
  };

  const updateFormState = (updatedInput) => {
    updatedInput.id === 'name'
      ? setExerciseNameInput(updatedInput)
      : updatedInput.id === 'category'
      ? setCategoryInput(updatedInput)
      : updatedInput.id === 'description'
      ? setDescriptionInput(updatedInput)
      : (() => {
          throw new Error('Something went wrong in updateFormState');
        })();
  };

  const inputChangedHandler = (e, input) => {
    if (e.target) e.value = e.target.value;

    const updatedInput = updateObject(input, {
      value:
        input.elementType === 'select'
          ? input.elementConfig.options.filter(
              (option) => option.value === e.value
            )[0]
          : e.value,
      valid: checkValidityHandler(e.value.toString(), input.validation),
      touched: true,
    });

    updateFormState(updatedInput);

    checkFormValidity(updatedInput);
  };

  const form = formFields.map((field) => (
    <Input
      elementConfig={field.elementConfig}
      elementType={field.elementType}
      value={field.value}
      label={field.label}
      key={field.id}
      changed={(e) => inputChangedHandler(e, field)}
      required={field.validation.required}
      classname={field.className}
      wrapperClass={field.wrapperClass}
    />
  ));

  return (
    <>
      {form}
      <h4>Select all needed equipment</h4>
      <div className={`${classes.CheckBoxGroup} ${classes.EquipmentBoxes}`}>
        {equipmentCheckboxes}
      </div>

      <h4>Select all primary muscles worked</h4>
      <div className={`${classes.CheckBoxGroup} ${classes.MuscleBoxes}`}>
        {generateMuscleCheckboxes('primary')}
      </div>

      <h4>Select all secondary muscles worked</h4>
      <div className={`${classes.CheckBoxGroup} ${classes.MuscleBoxes}`}>
        {generateMuscleCheckboxes('secondary')}
      </div>

      <SubmitExerciseBtn
        formIsValid={formIsValid}
        nameIsValid={exerciseNameInput.valid}
        categoryIsValid={categoryInput.valid}
        title={exerciseNameInput.value}
        description={descriptionInput.value || null}
        category={categoryInput.value}
        primaryMuscles={utils.getCheckedBoxes(primaryMusclesUsed)}
        secondaryMuscles={utils.getCheckedBoxes(requiredEquipmentList)}
        equipment={utils.getCheckedBoxes(secondaryMusclesUsed)}
      />
    </>
  );
}
