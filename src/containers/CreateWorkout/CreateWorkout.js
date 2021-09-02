import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import WorkoutListItem from '../WorkoutListItem/WorkoutListItem';
import SubmitWorkoutBtn from '../../components/SubmitWorkoutBtn/SubmitWorkoutBtn';
import Spinner from '../../components/UI/Spinner/Spinner';
import FavoritesSelectMenu from './FavoritesSelectMenu/FavoritesSelectMenu';
import WorkoutDetailsForm from './WorkoutDetailsForm/WorkoutDetailsForm';
import {
  enterSearchMode,
  selectAllExercises,
  setExercises,
  setFirebaseId,
  setFormData,
} from '../../store/workoutSlice';
import classes from './CreateWorkout.module.css';

export default function CreateWorkout({ history }) {
  const exercises = useSelector(selectAllExercises);
  const { formData, firebaseId } = useSelector((state) => state.workout);

  const dispatch = useDispatch();

  const [loaded, setLoaded] = useState(false);
  const [formDataLoaded, setFormDataLoaded] = useState(false);
  const [shouldClearFormInputs, setShouldClearFormInputs] = useState(false);
  const [shouldSetInputAsTouched, setShouldSetInputAsTouched] = useState(false);

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

  const { noFavorites } = useSelector((state) => state.favorites);

  useEffect(() => {
    const shouldLoadWorkoutData = history.location.state;
    if (shouldLoadWorkoutData) {
      const { workout } = history.location.state;
      const { title: workoutName } = workout;
      const targetArea = {
        value: workout.targetAreaCode,
        label: workout.targetArea,
      };
      const secondaryTarget = {
        value: workout.secondaryTargetCode,
        label: workout.secondaryTargetArea,
      };

      dispatch(setFormData({ workoutName, targetArea, secondaryTarget }));
      dispatch(setExercises(workout.exercises));
      dispatch(setFirebaseId(workout.firebaseId));
      setFormIsValid(true);
      setFormDataLoaded(true);
    } else {
      setFormDataLoaded(true);
    }
  }, [history, dispatch]);

  useEffect(() => {
    if (noFavorites) setLoaded(true);
  }, [loaded, noFavorites]);

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
    formDataLoaded && (
      <>
        <div className={classes.Wrapper} style={{ display: !loaded && 'none' }}>
          {error.isError && error.message}

          <WorkoutDetailsForm
            shouldClearFormInputs={shouldClearFormInputs}
            setShouldClearFormInputsToFalse={() =>
              setShouldClearFormInputs(false)
            }
            shouldSetInputAsTouched={shouldSetInputAsTouched}
            shouldSetInputAsTouchedToFalse={() =>
              setShouldSetInputAsTouched(false)
            }
            setFormIsValid={() => setFormIsValid(true)}
          />

          {!noFavorites && (
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
                setInputAsTouched={() => setShouldSetInputAsTouched(true)}
                firebaseId={firebaseId}
                shouldCreateNewWorkout={firebaseId === null}
              />

              {clearWorkoutBtn}
            </>
          ) : null}
        </div>

        <div style={{ display: loaded && 'none' }}>
          <Spinner />
        </div>
      </>
    )
  );
}
