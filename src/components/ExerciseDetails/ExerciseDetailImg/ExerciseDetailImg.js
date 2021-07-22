import wgerData from '../../../shared/wgerData';
import classes from './ExerciseDetailImg.module.css';

export default function ExerciseDetailImg({
  primaryMuscles,
  secondaryMuscles,
}) {
  const muscularSystemFront = `URL('https://wger.de/static/images/muscles/muscular_system_front.svg')`;

  const muscularSystemBack = `URL('https://wger.de/static/images/muscles/muscular_system_back.svg')`;

  /*
    Each of the 4 variables below works as follows:
      1: Maps through the array of either primary or secondary muscles, and if they belong to the appropriate musclular system
        (either front or back) it will return an array containg a str that can be used to include it in the background image
      2: If it was not in the appropriate muscular system, it adds an empty string to the array. The filter statement removes the empty strings
      3: Finally it joins the array with the desired strings into one string that can be used in a css background image property.
  */

  const primaryFrontMusclesStr = primaryMuscles
    .map((muscle) =>
      wgerData.muscles[muscle].is_front
        ? `URL(${wgerData.muscles[muscle].image_url_main})`
        : ''
    )
    .filter((str) => str !== '')
    .join(',');

  const primaryBackMusclesStr = primaryMuscles
    .map((muscle) =>
      !wgerData.muscles[muscle].is_front
        ? `URL(${wgerData.muscles[muscle].image_url_main})`
        : ''
    )
    .filter((str) => str !== '')
    .join(',');

  const secondaryMusclesFrontStr = secondaryMuscles
    .map((muscle) =>
      wgerData.muscles[muscle].is_front
        ? `URL(${wgerData.muscles[muscle].image_url_secondary})`
        : ''
    )
    .filter((str) => str !== '')
    .join(',');

  const secondaryMusclesBackStr = secondaryMuscles
    .map((muscle) =>
      !wgerData.muscles[muscle].is_front
        ? `URL(${wgerData.muscles[muscle].image_url_secondary})`
        : ''
    )
    .filter((str) => str !== '')
    .join(',');

  const displayMuscularSystemFront =
    primaryFrontMusclesStr || secondaryMusclesFrontStr;
  const displayMuscularSystemBack =
    primaryBackMusclesStr || secondaryMusclesBackStr;

  return displayMuscularSystemBack || displayMuscularSystemFront ? (
    <>
      <div className={classes.ColorKey}>
        <p>
          <span className={classes.MainKey}></span>Main Muscles
        </p>
        <p>
          <span className={classes.SecondaryKey}></span>Secondary Muscles
        </p>
      </div>
      <div className={classes.Wrapper}>
        {displayMuscularSystemFront && (
          <div
            className={classes.Img}
            style={{
              backgroundImage: `${
                primaryFrontMusclesStr ? primaryFrontMusclesStr + ',' : ''
              } ${
                secondaryMusclesFrontStr ? secondaryMusclesFrontStr + ',' : ''
              } ${muscularSystemFront}`,
            }}
          ></div>
        )}
        {displayMuscularSystemBack && (
          <div
            className={classes.Img}
            style={{
              backgroundImage: `${
                primaryBackMusclesStr ? primaryBackMusclesStr + ',' : ''
              } ${
                secondaryMusclesBackStr ? secondaryMusclesBackStr + ',' : ''
              } ${muscularSystemBack}`,
            }}
          ></div>
        )}
      </div>
    </>
  ) : (
    <></>
  );
}
