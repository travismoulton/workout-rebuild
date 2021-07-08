import wgerData from '../../shared/wgerData';

const mock = {
  mockCategories: [
    {
      id: 10,
      name: 'Example Category 1',
    },
    {
      id: 8,
      name: 'Example Category 2',
    },
    {
      id: 7,
      name: 'Example Category 3',
    },
  ],
  mockMuscles: [
    {
      id: 2,
      name: 'Example Muscle 1',
      is_front: true,
      image_url_main: 'https://wger.de/static/images/muscles/main/muscle-2.svg',
      image_url_secondary:
        'https://wger.de/static/images/muscles/secondary/muscle-2.svg',
    },
    {
      id: 1,
      name: 'Example Muscle 2',
      is_front: true,
      image_url_main: 'https://wger.de/static/images/muscles/main/muscle-1.svg',
      image_url_secondary:
        'https://wger.de/static/images/muscles/secondary/muscle-1.svg',
    },
  ],
  mockEquipment: [
    {
      id: 1,
      name: 'Example equipment 1',
    },
    {
      id: 8,
      name: 'Example equipment 2',
    },
    {
      id: 3,
      name: 'Example equipment 3',
    },
    {
      id: 2,
      name: 'Example equipment 4',
    },
  ],
};

export default mock;
