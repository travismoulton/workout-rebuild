import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { resultsUtils as utils } from './resultsUtils';
import Spinner from '../../components/UI/Spinner/Spinner';
import wgerData from '../../shared/wgerData';

export default function Results(props) {
  const [exerciseResults, setExerciseResults] = useState([]);
  const [favoriteExerciseIds, setFavoriteExerciseIds] = useState([]);
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
    const param =
      props.location.state.category === 'exercisecategory'
        ? `category=${props.location.state.id}`
        : props.location.state.category === 'muscle'
        ? `muscles=${props.location.state.id}`
        : `equipment=${props.location.state.id}`;

    utils.fetchWgerExercises(param).then((res) => setExerciseResults(res));

    console.log(param);
  }, [exerciseResults, props]);

  return <h1>Results</h1>;
}
