import { useState, useEffect } from 'react';

import { resultsUtils as utils } from './resultsUtils';
import ExerciseResult from '../../components/ExerciseResult/ExerciseResult';
import Spinner from '../../components/UI/Spinner/Spinner';
import wgerData from '../../shared/wgerData';

export default function Results(props) {
  const [exerciseResults, setExerciseResults] = useState([]);
  const [error, setError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        We're having trouble loading the exercises right now. Please go back to
        the search page and try again
      </p>
    ),
  });

  // const { user, uid, accessToken } = useSelector((state) => state.auth);

  const { category, subCategory, id, custom, wger } = props.location.state;

  useEffect(() => {
    document.title =
      category === 'exercisecategory'
        ? `Category: ${subCategory}`
        : category === 'muscle'
        ? `Muscle: ${subCategory}`
        : category === 'equipment'
        ? `Equipment: ${subCategory}`
        : 'My Custom Exercises';
  }, [subCategory, category]);

  useEffect(() => {
    if (!exerciseResults.length && !error.isError) {
      const param = utils.getParam(category, id);

      utils
        .fetchWgerExercises(param)
        .then((res) => setExerciseResults(res))
        .catch((err) => setError({ ...error, isError: true }));
    }
  }, [exerciseResults, category, id, error]);

  console.log(exerciseResults);

  const displayResults = exerciseResults.map((exercise) => (
    <ExerciseResult
      key={exercise.name}
      name={exercise.name}
      category={wgerData.exerciseCategoryList[exercise.category]}
      equipment={
        exercise.equipment && wgerData.equipment[exercise.equipment[0]]
      }
      custom={custom}
      firebaseSearchId={exercise.firebaseId}
      exerciseId={exercise.id}
    />
  ));

  return (
    <>
      {error.isError && error.message}
      <h3>{wger ? subCategory : 'My custom exercises'}</h3>
      {exerciseResults.length ? (
        <ul style={{ padding: '0' }}>{displayResults}</ul>
      ) : (
        <Spinner />
      )}
    </>
  );
}
