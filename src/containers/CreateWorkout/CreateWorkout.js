import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import WorkoutListItem from '../WorkoutListItem/WorkoutListItem';
import SubmitWorkoutBtn from '../../components/SubmitWorkoutBtn/SubmitWorkoutBtn';
import Spinner from '../../components/UI/Spinner/Spinner';
import FavoritesSelectMenu from './FavoritesSelectMenu/FavoritesSelectMenu';
import WorkoutDetailsForm from './WorkoutDetailsForm/WorkoutDetailsForm';
import { enterSearchMode, selectAllExercises } from '../../store/workoutSlice';
import classes from './CreateWorkout.module.css';

export default function CreateWorkout({ history }) {
  const exercises = useSelector(selectAllExercises);
  const { formData, firebaseId } = useSelector((state) => state.workout);

  const dispatch = useDispatch();

  const [loaded, setLoaded] = useState(false);
  const [shouldClearFormInputs, setShouldClearFormInputs] = useState(false);
  const [shouldSetInputAsTouched, setShouldSetInputAsTouuched] =
    useState(false);
  const [shouldLoadWorkoutData, setShouldLoadWorkoutData] = useState(
    history.location.state
  );
  const [error, setError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        Sorry, something went wrong trying to get some of your favorites. Please
        refresh the page or try again later
      </p>
    ),
  });
  // The form should be valid if the component renders with a workoutName coming from redux
  const [formIsValid, setFormIsValid] = useState(
    formData.workoutName ? true : false
  );

  const { user } = useSelector((state) => state.auth);
  const { noFavorites } = useSelector((state) => state.favorites);

  useEffect(() => {
    if (noFavorites || !user) setLoaded(true);
  }, [loaded, noFavorites, user]);

  useEffect(() => {
    document.title = 'Create Workout';
  }, []);

  useEffect(() => {
    if (error.isError) setLoaded(true);
  }, [error, loaded]);

  const onAddExerciseBySearchClick = () => {
    dispatch(enterSearchMode());
    history.push('/search');
  };

  const clearWorkoutBtn = (
    <button
      className={`GlobalBtn-1 ${classes.ClearBtn}`}
      onClick={() => setShouldClearFormInputs(true)}
    >
      Clear form
    </button>
  );

  return (
    <>
      <div className={classes.Wrapper} style={{ display: !loaded && 'none' }}>
        {error.isError && error.message}

        <WorkoutDetailsForm
          shouldLoadWorkoutData={shouldLoadWorkoutData}
          history={history}
          setShouldLoadWorkoutDataToFalse={() =>
            setShouldLoadWorkoutData(false)
          }
          setFormIsValid={(bool) => setFormIsValid(bool)}
          shouldClearFormInputs={shouldClearFormInputs}
          setShouldClearFormInputsToFalse={() =>
            setShouldClearFormInputs(false)
          }
          shouldSetInputAsTouched={shouldSetInputAsTouched}
          shouldSetInputAsTouchedToFalse={() =>
            setShouldSetInputAsTouuched(false)
          }
        />

        {user && !noFavorites && (
          <FavoritesSelectMenu
            toggleLoaded={() => setLoaded(true)}
            toggleError={() => setError({ ...error, isError: true })}
            isError={error.isError}
            clearSelect={shouldClearFormInputs}
          />
        )}

        <button
          className={`GlobalBtn-1 ${classes.AddBySearchBtn}`}
          onClick={onAddExerciseBySearchClick}
        >
          Add from exercise search menu
        </button>
        {exercises.length ? (
          <>
            <ul className={classes.WorkoutList}>
              {exercises.map((exercise, i) => (
                <WorkoutListItem
                  name={exercise.name}
                  key={exercise.id}
                  id={exercise.id}
                  sets={exercise.sets}
                  isFirstExercise={i === 0}
                  isLastExercise={i === exercises.length - 1}
                  focus={exercise.focus}
                />
              ))}
            </ul>
            <SubmitWorkoutBtn
              formIsValid={formIsValid}
              setInputAsTouched={() => setShouldSetInputAsTouuched(true)}
              firebaseId={firebaseId}
              shouldCreateNewWorkout={firebaseId === null}
              history={history}
            />
            {clearWorkoutBtn}
          </>
        ) : null}
      </div>

      <div style={{ display: loaded && 'none' }}>
        <Spinner />
      </div>
    </>
  );
}
