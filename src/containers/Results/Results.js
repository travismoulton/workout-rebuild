import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';

import { resultsUtils as utils } from './resultsUtils';
import ExerciseResult from '../../components/ExerciseResult/ExerciseResult';
import Spinner from '../../components/UI/Spinner/Spinner';
import wgerData from '../../shared/wgerData';

export default function Results(props) {
  const [exerciseResults, setExerciseResults] = useState([]);
  // const [favoriteExerciseIds, setFavoriteExerciseIds] = useState([]);
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

  useEffect(() => {
    document.title =
      props.location.state.category === 'exercisecategory'
        ? `Category: ${props.location.state.subCategory}`
        : props.location.state.category === 'muscle'
        ? `Muscle: ${props.location.state.subCategory}`
        : props.location.state.category === 'equipment'
        ? `Equipment: ${props.location.state.subCategory}`
        : 'My Custom Exercises';
  }, [props.location.state]);

  useEffect(() => {
    if (!exerciseResults.length && !error.isError) {
      const { category, id } = props.location.state;
      const param = utils.getParam(category, id);

      utils
        .fetchWgerExercises(param)
        .then((res) => setExerciseResults(res))
        .catch((err) => setError({ ...error, isError: true }));
    }
  }, [exerciseResults, props.location.state, error]);

  const displayResults = exerciseResults.map((exercise) => (
    <ExerciseResult
      key={exercise.name}
      name={exercise.name}
      category={wgerData.exerciseCategoryList[exercise.category]}
      equipment={
        exercise.equipment && wgerData.equipment[exercise.equipment[0]]
      }
      isFavorite={false}
      firebaseId={null}
      custom={props.location.state.custom}
      firebaseSearchId={exercise.firebaseId}
    />
  ));

  return (
    <>
      {error.isError && error.message}
      <h3>
        {props.location.state.wger
          ? props.location.state.subCategory
          : 'My custom exercises'}
      </h3>
      {exerciseResults.length ? (
        <ul style={{ padding: '0' }}>{displayResults}</ul>
      ) : (
        <Spinner />
      )}
    </>
  );
}
