import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ExerciseDetailCategory from '../../components/ExerciseDetails/ExerciseDetailCategory/ExerciseDetailCategory';
import ExerciseDetailEquipment from '../../components/ExerciseDetails/ExerciseDetailEquipment/ExerciseDetailEquipment';
import ExerciseDetailDescription from '../../components/ExerciseDetails/ExerciseDetailDescription/ExerciseDetailDescription';
import ExerciseDetailMuscles from '../../components/ExerciseDetails/ExerciseDetailMuscles/ExerciseDetailMuscles';
import ExericseDetailImg from '../../components/ExerciseDetails/ExerciseDetailImg/ExerciseDetailImg';
import AddToWorkoutBtn from '../../components/AddToWorkoutBtn/AddToWorkoutBtn';
import Modal from '../../components/UI/Modal/Modal';
import FavoriteBtn from '../../components/FavoriteBtn/FavoriteBtn';
import classes from './ExerciseDetail.module.css';
import {
  removeFavorite,
  selectFavoriteFirebaseId,
} from '../../store/favoritesSlice';
import { exerciseDetailUtils as utils } from './exerciseDetailUtils';
import wgerData from '../../shared/wgerData';

const ExerciseDetail = ({ location, history }) => {
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

  const firebaseId = useSelector((state) =>
    selectFavoriteFirebaseId(state, exerciseId)
  );
  const isFavorite = firebaseId ? true : false;

  // const buildingWorkout = useSelector((state) => state.workout.buildingWorkout);
  const dispatch = useDispatch();

  useEffect(() => {
    if (exercise) document.title = exercise.name;
  }, [exercise]);

  useEffect(() => {
    if (!exercise && isCustom) {
      utils
        .fetchCustomExercise(uid, firebaseSearchId)
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
  }, [exercise, isCustom, exerciseId, firebaseSearchId, error, uid, user]);

  const deleteCustomExercise = async () => {
    if (isFavorite) dispatch(removeFavorite(uid, firebaseId));

    await axios({
      method: 'delete',
      url: `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${uid}/${firebaseSearchId}.json?auth=${accessToken}`,
      timeout: 5000,
    }).catch((err) => {
      setError({ ...error, isError: true, code: 'delete' });
    });

    setShowModal(false);

    history.push('/search');
  };

  const deleteCustomExerciseBtn = (
    <button
      className={`GlobalBtn-1 ${classes.DeleteBtn}`}
      onClick={() => setShowModal(true)}
    >
      Delete exercise
    </button>
  );

  const modal = (
    <Modal show={showModal} modalClosed={() => setShowModal(false)}>
      <p>Are you sure you want to delete this exercise?</p>
      <div className={classes.ModalBtnWrapper}>
        <button
          className={`GlobalBtn-1 ${classes.ConfirmBtn}`}
          onClick={deleteCustomExercise}
        >
          Delete exercise
        </button>
        <button
          className={`GlobalBtn-1 ${classes.CancelBtn}`}
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
      </div>
    </Modal>
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
      {isCustom ? deleteCustomExerciseBtn : null}

      {isCustom ? modal : null}
    </>
  );

  const noExerciseError = error.code === 'noExercise' && error.message;

  return exercise
    ? display
    : error.code === 'noExercise'
    ? noExerciseError
    : null;
};

export default ExerciseDetail;
