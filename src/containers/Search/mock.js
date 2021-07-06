import wgerData from '../../shared/wgerData';

const mock = {
  mockCategories: [
    {
      id: 10,
      name: 'Abs',
    },
    {
      id: 8,
      name: 'Arms',
    },
  ],
  mockMuscles: [
    [wgerData.muscles][0],
    [wgerData.muscles][1],
    [wgerData.muscles][2],
  ],
  mockEquipment: [
    {
      id: 1,
      name: 'barbell',
    },
    {
      id: 8,
      name: 'Bench',
    },
  ],
};

export default mock;
