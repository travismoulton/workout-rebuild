import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import RoutineLink from './RoutineLink/RoutineLink';
import '../UserProfile.module.css';
import {
  setRoutines,
  setActiveRoutine,
  toggleRoutineRefresh,
} from '../../../store/actions';
import classes from '../UserProfile.module.css';

const Routines = (props) => {
  const [randomState, setRandomState] = useState(false);
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);
  const [routineDeleted, setRoutineDeleted] = useState(false);
  const { uid, accessToken } = useSelector((state) => state.auth);
  const { routines, refreshRoutines } = useSelector(
    (state) => state.userProfile
  );
  const { activeRoutine } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  const fetchRoutines = useCallback(() => {
    axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/routines/${uid}.json?auth=${accessToken}`,
        { timeout: 5000 }
      )
      .then((res) => {
        if (res.data) {
          const tempArr = [];
          for (const key in res.data)
            tempArr.push({ ...res.data[key], firebaseId: key });
          dispatch(setRoutines(tempArr));
        } else if (!res.data) {
          dispatch(setRoutines(null));
        }
      })
      .catch((err) => {
        props.toggleError();
      });
  }, [uid, accessToken, dispatch, props]);

  useEffect(() => {
    if (!initialFetchCompleted && !props.isError) {
      fetchRoutines();
      setInitialFetchCompleted(true);
      props.setFetchCompleted();
    }
  }, [initialFetchCompleted, fetchRoutines, props]);

  useEffect(() => {
    if (refreshRoutines) {
      fetchRoutines();
      dispatch(toggleRoutineRefresh());
      setRandomState(true);
    }
  }, [randomState, refreshRoutines, dispatch, fetchRoutines]);

  useEffect(() => {
    if (routineDeleted) {
      fetchRoutines();
      setRoutineDeleted(false);
    }
  }, [routineDeleted, fetchRoutines]);

  const changeActiveRoutine = (routine, firebaseId) => {
    // If there is a current active routine in firebase, set the active routine property to false
    if (activeRoutine.firebaseId) {
      axios({
        method: 'patch',
        url: `https://workout-81691-default-rtdb.firebaseio.com/routines/${uid}/${activeRoutine.firebaseId}.json?auth=${accessToken}`,
        timeout: 5000,
        data: { activeRoutine: false },
      }).catch((err) => {
        props.toggleError();
      });
    }

    axios({
      method: 'patch',
      url: `https://workout-81691-default-rtdb.firebaseio.com/routines/${uid}/${firebaseId}.json?auth=${accessToken}`,
      timeout: 5000,
      data: { activeRoutine: true },
    }).catch((err) => {
      props.toggleError();
    });

    dispatch(setActiveRoutine({ ...routine, firebaseId }));
  };

  const deleteRoutine = (firebaseId) => {
    axios
      .delete(
        `https://workout-81691-default-rtdb.firebaseio.com/routines/${uid}/${firebaseId}.json?auth=${accessToken}`,
        { timeout: 5000 }
      )
      .then(() => setRoutineDeleted(true))
      .catch((err) => {
        props.toggleError();
      });
  };

  const routineLinks = routines ? (
    routines.map((routine) => (
      <RoutineLink
        key={routine.title}
        workouts={routine.workouts}
        title={routine.title}
        setActiveRoutine={() =>
          changeActiveRoutine(routine, routine.firebaseId)
        }
        numberOfWorkouts={
          routine.workouts
            ? routine.workouts.filter((workout) => workout !== 'Rest').length
            : 0
        }
        isActiveRoutine={
          activeRoutine
            ? routine.firebaseId === activeRoutine.firebaseId
            : false
        }
        deleteRoutine={() => deleteRoutine(routine.firebaseId)}
        routine={routine}
        setModalContent={(jsx) => props.setModalContent(jsx)}
        toggleModal={props.toggleModal}
      />
    ))
  ) : (
    <Link className={classes.NoRoutinesAvailable} to="/create-routine">
      No routines available, click here to create a routine
    </Link>
  );

  return (
    <div className={classes.Container}>
      <div className={classes.Header} onClick={props.triggerRoutinesShowing}>
        <h3>My Routines</h3>
        <div
          className={`${classes.Arrow} ${
            props.showRoutines ? 'ArrowDownWhite' : 'ArrowRightWhite'
          }`}
        ></div>
      </div>
      {props.showRoutines && routineLinks}
    </div>
  );
};

export default Routines;
