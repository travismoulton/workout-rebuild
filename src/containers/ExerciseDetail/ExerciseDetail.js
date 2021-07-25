import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ExerciseDetailCategory from '../../components/ExerciseDetails/ExerciseDetailCategory/ExerciseDetailCategory';
import ExerciseDetailEquipment from '../../components/ExerciseDetails/ExerciseDetailEquipment/ExerciseDetailEquipment';
import ExerciseDetailDescription from '../../components/ExerciseDetails/ExerciseDetailDescription/ExerciseDetailDescription';
import ExerciseDetailMuscles from '../../components/ExerciseDetails/ExerciseDetailMuscles/ExerciseDetailMuscles';
import ExericseDetailImg from '../../components/ExerciseDetails/ExerciseDetailImg/ExerciseDetailImg';
import DeleteCustomExerciseModal from './DeleteCustomExerciseModal/DeleteCustomExerciseModal';
// import AddToWorkoutBtn from '../../components/AddToWorkoutBtn/AddToWorkoutBtn';

import FavoriteBtn from '../../components/FavoriteBtn/FavoriteBtn';
import classes from './ExerciseDetail.module.css';

import { exerciseDetailUtils as utils } from './exerciseDetailUtils';
import wgerData from '../../shared/wgerData';

export default function ExerciseDetail({ location, history }) {
  const { firebaseSearchId, exerciseId, isCustom } = location.state;

  const [exercise, setExercise] = useState();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        We're having trouble loading this page right now. Please refresh the
        page or try again later
      </p>
    ),
    code: '',
  });
  const { user, uid, accessToken } = useSelector((state) => state.auth);

  // const buildingWorkout = useSelector((state) => state.workout.buildingWorkout);

  useEffect(() => {
    if (exercise) document.title = exercise.name;
  }, [exercise]);

  useEffect(() => {
    if (!exercise && isCustom) {
      utils
        .fetchCustomExercise(uid, accessToken, firebaseSearchId)
        .then((exercise) => setExercise(exercise))
        .catch((err) => {
          setError({ ...error, isError: true, code: 'noExercise' });
        });
    } else if (!exercise && !isCustom) {
      utils
        .fetchWgerExercise(exerciseId)
        .then((exercise) => setExercise(exercise))
        .catch((err) => {
          setError({ ...error, isError: true, code: 'noExercise' });
        });
    }
  }, [
    exercise,
    isCustom,
    exerciseId,
    firebaseSearchId,
    error,
    uid,
    user,
    accessToken,
  ]);

  const showDeleteExerciseModalBtn = (
    <button
      className={`GlobalBtn-1 ${classes.DeleteBtn}`}
      onClick={() => setShowModal(true)}
    >
      Delete exercise
    </button>
  );

  const display = exercise && (
    <>
      {error.code === 'delete' && error.message}

      <h1 className={classes.ExerciseName}>{exercise.name}</h1>
      <ExerciseDetailCategory
        category={wgerData.exerciseCategoryList[exercise.category]}
      />
      <ExerciseDetailEquipment
        equipment={
          exercise.equipment
            ? exercise.equipment.map((el) => wgerData.equipment[el])
            : []
        }
      />
      {exercise.description && (
        <ExerciseDetailDescription description={exercise.description} />
      )}

      <ExerciseDetailMuscles
        muscles={
          exercise.muscles
            ? exercise.muscles.map((muscle) => wgerData.muscles[muscle])
            : []
        }
        secondary={
          exercise.muscles_secondary
            ? exercise.muscles_secondary.map(
                (muscle) => wgerData.muscles[muscle]
              )
            : []
        }
      />
      <ExericseDetailImg
        primaryMuscles={exercise.muscles || []}
        secondaryMuscles={exercise.muscles_secondary || []}
      />

      {user && (
        <div className={classes.BtnContainer}>
          <FavoriteBtn exerciseId={exerciseId} />
        </div>
      )}
      {/* {buildingWorkout && (
        <div className={classes.AddToWorkoutBtnContainer}>
          <AddToWorkoutBtn
            history={props.history}
            id={exerciseId}
            name={exercise.name}
          />
        </div>
      )} */}
      {isCustom && showDeleteExerciseModalBtn}
      {isCustom && (
        <DeleteCustomExerciseModal
          exerciseId={exerciseId}
          show={showModal}
          closeModal={() => setShowModal(false)}
          firebaseSearchId={firebaseSearchId}
        />
      )}
    </>
  );

  const noExerciseError = error.code === 'noExercise' && error.message;

  if (error.code === 'noExercise') return noExerciseError;

  return exercise ? display : null;
}
