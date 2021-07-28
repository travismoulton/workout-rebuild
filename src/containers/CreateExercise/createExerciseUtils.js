import wgerData from '../../shared/wgerData';

export const createExerciseUtils = {
  getEquipment: function () {
    const equipment = [];
    for (const key in wgerData.equipment) {
      equipment.push({ code: key, name: wgerData.equipment[key] });
    }
    return equipment;
  },

  getMuscles: function () {
    const muscles = [];
    for (const key in wgerData.muscles) {
      muscles.push({ code: key, name: wgerData.muscles[key].name });
    }
    return muscles;
  },

  getCheckedBoxes: function (checkBoxSet) {
    let checkedBoxes = [];
    for (let key in checkBoxSet) {
      if (checkBoxSet[key].checked) checkedBoxes.push(key);
    }
    return checkedBoxes;
  },
};

export const templates = {
  exerciseName: {
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Exercise name',
    },
    value: '',
    validation: {
      required: true,
    },
    testid: 'exerciseName',
    valid: false,
    touched: false,
    id: 'name',
    className: 'ExerciseName',
  },

  description: {
    elementType: 'textarea',
    elementConfig: {
      placeholder: 'Description of exercise...',
    },
    value: '',
    validation: {
      required: false,
    },
    testid: 'description',
    valid: false,
    touched: false,
    id: 'description',
    className: 'CreateExerciseDescription',
  },

  category: {
    elementType: 'select',
    elementConfig: {
      options: [
        { value: '', label: '' },
        { value: 10, label: 'Abs' },
        { value: 8, label: 'Arms' },
        { value: 12, label: 'Back' },
        { value: 14, label: 'Calves' },
        { value: 11, label: 'Chest' },
        { value: 9, label: 'Legs' },
        { value: 13, label: 'Shoulders' },
        { value: 99, label: 'All Body' },
        { value: 98, label: 'Cardio' },
      ],
    },
    value: 0,
    label: 'Exercise Category',
    validation: {
      required: true,
    },
    testid: 'category',
    valid: false,
    touched: false,
    selectId: 'category',
    id: 'category',
    className: 'CreateExerciseSelect',
    wrapperClass: 'CreateExerciseSelectWrapper',
  },

  requiredEquipmentList: {
    1: { name: 'Barbell', checked: false },
    8: { name: 'Bench', checked: false },
    3: { name: 'Dumbbell', checked: false },
    4: { name: 'Gym mat', checked: false },
    9: { name: 'Incline bench', checked: false },
    10: { name: 'Kettlebell', checked: false },
    7: { name: 'Body weight', checked: false },
    6: { name: 'Pull-up bar', checked: false },
    5: { name: 'Swiss Ball', checked: false },
    2: { name: 'SZ-Bar', checked: false },
  },

  checkBox: {
    elementType: 'input',
    elementConfig: {
      type: 'checkbox',
    },
    value: false,
    validation: { required: false },
    valid: true,
    touched: false,
    checked: false,
    label: null,
    className: 'Checkbox',
  },
};
