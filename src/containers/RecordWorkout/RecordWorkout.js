import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { recordWorkoutUtils as utils } from './recordWorkoutUtils';
import WorkoutListItem from '../WorkoutListItem/WorkoutListItem';
import RecordWorkoutBtn from '../../components/RecordWorkoutBtn/RecordWorkoutBtn';
import Spinner from '../../components/UI/Spinner/Spinner';
import RecordADifferentWorkout from '../../components/RecordADifferentWorkout/RecordADifferentWorkout';
import ChangeWorkoutRecordDate from './ChangeRecordWorkoutDate/ChangeWorkoutRecordDate';
import {
  setExercises,
  resetWorkoutStore,
  selectAllExercises,
  clearExercises,
} from '../../store/workoutSlice';
import classes from './RecordWorkout.module.css';

export default function RecordWorkout() {
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [suggestedWorkout, setSuggestedWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChangeDateModal, setShowChangeDateModal] = useState(false);
  const [showRecordDifferentWorkoutModal, setShowRecordDifferentWorkoutModal] =
    useState(false);
  const [error, setError] = useState({ isError: false, message: '', code: '' });

  const { uid, accessToken } = useSelector((state) => state.auth);
  const { activeRoutine } = useSelector((state) => state.favorites);

  const exercises = useSelector(selectAllExercises);
  const { updated } = useSelector((state) => state.workout);

  const dispatch = useDispatch();

  const history = useHistory();

  const { fetchWorkoutById, pushUpdateToFirebase } = utils;

  const workoutDateRef = useRef(null);
  if (!workoutDateRef.current) workoutDateRef.current = workoutDate;

  useEffect(() => {
    document.title = 'Record Workout';
  }, []);

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      dispatch(resetWorkoutStore());
      dispatch(clearExercises());
      unlisten();
    });

    return unlisten;
  });

  const adjustDateForSunday = useCallback(() => {
    return workoutDate.getDay() === 0 ? 6 : workoutDate.getDay() - 1;
  }, [workoutDate]);

  const activeRoutineError = useMemo(
    () => ({
      isError: true,
      message: (
        <p>
          Sorry, we can't load your workouts right now. Please refresh the page
          or try again later
        </p>
      ),
      code: 'activeRoutineError',
    }),
    []
  );

  const getWorkoutBasedOnDay = useCallback(() => {
    if (activeRoutine) {
      const workoutFirebaseId = activeRoutine.workouts[adjustDateForSunday()];

      if (workoutFirebaseId !== 'Rest') {
        fetchWorkoutById(uid, accessToken, workoutFirebaseId)
          .then(({ data }) => {
            setSuggestedWorkout({
              ...data,
              firebaseId: workoutFirebaseId,
            });
            dispatch(setExercises(data.exercises));
            if (loading) setLoading(false);
          })
          .catch(() => {
            setError(activeRoutineError);
          });
      } else if (workoutFirebaseId === 'Rest') {
        setSuggestedWorkout(null);
        if (exercises.length) dispatch(setExercises([]));
        if (loading) setLoading(false);
      }
    } else if (!activeRoutine && loading) setLoading(false);
  }, [
    adjustDateForSunday,
    activeRoutine,
    uid,
    accessToken,
    loading,
    dispatch,
    exercises,
    fetchWorkoutById,
    activeRoutineError,
  ]);

  useEffect(() => {
    if (workoutDateRef.current !== workoutDate) {
      getWorkoutBasedOnDay();
      workoutDateRef.current = workoutDate;
    }
  }, [getWorkoutBasedOnDay, workoutDate, suggestedWorkout]);

  useEffect(() => {
    if (!suggestedWorkout) {
      getWorkoutBasedOnDay();
    }
  }, [suggestedWorkout, getWorkoutBasedOnDay]);

  // If an exercise is removed, updated suggested workout and re-render
  useEffect(() => {
    const exerciseRemoved =
      exercises.length &&
      suggestedWorkout &&
      exercises.length !== suggestedWorkout.exercises.length;
    if (exerciseRemoved)
      setSuggestedWorkout({ ...suggestedWorkout, exercises });
  }, [exercises, suggestedWorkout]);

  const displayExercises =
    suggestedWorkout &&
    exercises.map((exercise) => (
      <WorkoutListItem
        name={exercise.name}
        key={exercise.id}
        id={exercise.id}
        sets={exercise.sets}
        inRecordMode={true}
        focus={exercise.focus}
      />
    ));

  const updateWorkoutInFirebase = async () => {
    const workoutFirebaseId = suggestedWorkout.firebaseId;
    const workoutData = {
      title: suggestedWorkout.title,
      targetAreaCode: suggestedWorkout.targetAreaCode,
      secondaryTargetCode: suggestedWorkout.secondaryTargetCode,
      targetArea: suggestedWorkout.targetArea,
      secondaryTargetArea: suggestedWorkout.secondaryTargetArea,
      exercises,
    };
    await pushUpdateToFirebase(
      uid,
      accessToken,
      workoutFirebaseId,
      workoutData
    ).catch(() => {
      setError({
        isError: true,
        message: (
          <p style={{ color: 'red' }}>
            Sorry, we're having trouble processing your request right now.
            Please refresh the page and record the workout again, or come back
            later
          </p>
        ),
      });

      throw new Error(
        'Workout update failed. Stop function execution so the recordWorkout will not hit firebase'
      );
    });
  };

  const recordADifferentWorkoutBtn = (
    <button
      className={`GlobalBtn-1 ${classes.OpenModalBtn}`}
      onClick={() => setShowRecordDifferentWorkoutModal(true)}
    >
      Record a different workout today
    </button>
  );

  const recordDifferentDayBtn = (
    <button
      className={`GlobalBtn-1 ${classes.OpenModalBtn}`}
      onClick={() => setShowChangeDateModal(true)}
    >
      Record a workout for a different day
    </button>
  );

  function switchWorkout(workoutId) {
    workoutId
      ? fetchWorkoutById(uid, accessToken, workoutId)
          .then(({ data }) => {
            setSuggestedWorkout({ ...data, firebaseId: workoutId });
            dispatch(setExercises(data.exercises));
            if (error.code === 'noSelectedWorkout') setError(null);
          })
          .catch(() => {
            setError({
              isError: true,
              message: (
                <p style={{ color: 'red' }}>
                  Sorry, we were not able to load the workout. Please refresh
                  the page and try again, or come back later
                </p>
              ),
              code: 'switchWorkout',
            });
          })
      : setError({
          isError: true,
          message: (
            <p style={{ color: 'red' }}>
              No Workout was selected. Please select a workout to record
            </p>
          ),
          code: 'noSelectedWorkout',
        });
  }

  const finalDisplay = (
    <>
      {error.isError && error.message}
      <h1>{workoutDate.toString().substring(0, 15)}</h1>
      {suggestedWorkout ? <h3>{suggestedWorkout.title}</h3> : <h3>Rest</h3>}
      {recordADifferentWorkoutBtn}
      {recordDifferentDayBtn}
      <div className={classes.WorkoutContainer}>{displayExercises}</div>
      {suggestedWorkout && exercises.length ? (
        <RecordWorkoutBtn
          workout={suggestedWorkout}
          date={workoutDate}
          isUpdated={updated}
          updateWorkoutInFirebase={updateWorkoutInFirebase}
        />
      ) : null}

      <RecordADifferentWorkout
        show={showRecordDifferentWorkoutModal}
        closeModal={() => setShowRecordDifferentWorkoutModal(false)}
        switchWorkout={(workoutId) => switchWorkout(workoutId)}
      />

      <ChangeWorkoutRecordDate
        show={showChangeDateModal}
        closeModal={() => setShowChangeDateModal(false)}
        changeDate={(date) => setWorkoutDate(date)}
      />
    </>
  );

  return loading ? <Spinner /> : finalDisplay;
}
