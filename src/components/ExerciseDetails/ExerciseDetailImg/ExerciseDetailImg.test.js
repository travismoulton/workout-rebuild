import { customRender } from '../../../shared/testUtils';
import ExerciseDetailImg from './ExerciseDetailImg';
import wgerData from '../../../shared/wgerData';

describe('<ExerciseDetailImg>', () => {
  const muscularSystemFront = `URL('https://wger.de/static/images/muscles/muscular_system_front.svg')`;
  const muscularSystemBack = `URL('https://wger.de/static/images/muscles/muscular_system_back.svg')`;

  test('returns an empty fragment if not given any muscles', () => {
    const { container } = customRender(
      <ExerciseDetailImg primaryMuscles={[]} secondaryMuscles={[]} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('returns an image of front muscular system with primary muscles', () => {
    const { getByTestId } = customRender(
      <ExerciseDetailImg primaryMuscles={[4, 10]} secondaryMuscles={[]} />
    );

    const testIdStr = `URL(${wgerData.muscles[4].image_url_main}),URL(${wgerData.muscles[10].image_url_main}), ${muscularSystemFront}`;
    expect(getByTestId(testIdStr)).toBeInTheDocument();
  });

  test('returns an image of back muscular secondary muscles', () => {
    const { getByTestId } = customRender(
      <ExerciseDetailImg primaryMuscles={[]} secondaryMuscles={[11, 12]} />
    );

    const testIdStr = `URL(${wgerData.muscles[11].image_url_secondary}),URL(${wgerData.muscles[12].image_url_secondary}), ${muscularSystemBack}`;
    expect(getByTestId(testIdStr)).toBeInTheDocument();
  });

  test('returns images of the front and back muscluar systems, with primary and secondary muscles', () => {
    const { getByTestId } = customRender(
      <ExerciseDetailImg primaryMuscles={[2, 11]} secondaryMuscles={[13, 7]} />
    );

    const testIdStrFront = `URL(${wgerData.muscles[2].image_url_main}),URL(${wgerData.muscles[13].image_url_secondary}), ${muscularSystemFront}`;
    const testIdStrBack = `URL(${wgerData.muscles[11].image_url_main}),URL(${wgerData.muscles[7].image_url_secondary}), ${muscularSystemBack}`;

    expect(getByTestId(testIdStrFront)).toBeInTheDocument();
    expect(getByTestId(testIdStrBack)).toBeInTheDocument();
  });
});
