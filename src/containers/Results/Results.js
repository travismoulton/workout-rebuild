import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

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

  const { user, uid, accessToken } = useSelector((state) => state.auth);

  const { category, subCategory, id, isCustom, wger } = props.location.state;
  const { fetchCustomExercises, fetchWgerExercises } = utils;

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

      fetchWgerExercises(param)
        .then((res) => setExerciseResults(res))
        .catch((err) => setError({ ...error, isError: true }));
    }
  }, [exerciseResults, category, id, error, fetchWgerExercises]);

  useEffect(() => {
    const shouldFetchCustomExercises = isCustom && !exerciseResults.length;

    if (shouldFetchCustomExercises)
      fetchCustomExercises(uid, accessToken)
        .then((exercises) => setExerciseResults(exercises))
        .catch(() => setError({ ...error, isError: true }));
  }, [
    fetchCustomExercises,
    error,
    exerciseResults,
    uid,
    accessToken,
    isCustom,
  ]);

  const displayResults = exerciseResults.map((exercise) => (
    <ExerciseResult
      key={exercise.name}
      name={exercise.name}
      category={wgerData.exerciseCategoryList[exercise.category]}
      equipment={
        exercise.equipment && wgerData.equipment[exercise.equipment[0]]
      }
      isCustom={isCustom}
      firebaseSearchId={exercise.firebaseId}
      exerciseId={exercise.id}
    />
  ));

  return (
    <>
      {error.isError && error.message}
      <h3>{wger ? subCategory : 'My custom exercises'}</h3>
      {exerciseResults.length ? (
        <ul style={{ padding: '0' }} data-testid="ResultsUL">
          {displayResults}
        </ul>
      ) : (
        <Spinner />
      )}
    </>
  );
}
