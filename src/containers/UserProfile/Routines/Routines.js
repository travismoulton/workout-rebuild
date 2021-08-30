import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { routinesUtils as utils } from './routinesUtils';
import RoutineLink from './RoutineLink/RoutineLink';
import { setActiveRoutine } from '../../../store/favoritesSlice';
import { removeRoutine, selectRoutines } from '../../../store/userProfileSlice';
import classes from '../UserProfile.module.css';

export default function Routines(props) {
  const {
    toggleError,
    setModalContent,
    toggleModal,
    triggerRoutinesShowing,
    showRoutines,
  } = props;

  const { uid, accessToken } = useSelector((state) => state.auth);
  const routines = useSelector(selectRoutines);
  const { activeRoutine } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  const { deleteRoutine, changeActiveRoutineStatus } = utils;

  const changeActiveRoutine = async (routine, firebaseId) => {
    // If there is a current active routine in firebase, set the active routine property to false
    if (activeRoutine) {
      const activeRoutineData = {
        ...activeRoutine,
        activeRoutine: false,
        id: null,
        firebaseId: null,
      };
      await changeActiveRoutineStatus(
        uid,
        accessToken,
        activeRoutine.firebaseId,
        activeRoutineData
      ).catch(() => toggleError());
    }

    const routineData = {
      ...routine,
      activeRoutine: true,
      id: null,
      firebaseId: null,
    };
    await changeActiveRoutineStatus(
      uid,
      accessToken,
      firebaseId,
      routineData
    ).catch(() => toggleError());

    dispatch(setActiveRoutine({ ...routine, firebaseId }));
  };

  const deleteRoutineHandler = (firebaseId) => {
    deleteRoutine(uid, accessToken, firebaseId);
    dispatch(removeRoutine(firebaseId));

    // If the routine deleted is the active routine, set activeRoutine to null
    if (activeRoutine.firebaseId === firebaseId)
      dispatch(setActiveRoutine(null));
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
        deleteRoutine={() => deleteRoutineHandler(routine.firebaseId)}
        routine={routine}
        setModalContent={(jsx) => setModalContent(jsx)}
        toggleModal={toggleModal}
      />
    ))
  ) : (
    <Link className={classes.NoRoutinesAvailable} to="/create-routine">
      No routines available, click here to create a routine
    </Link>
  );

  return (
    <div className={classes.Container}>
      <div className={classes.Header} onClick={triggerRoutinesShowing}>
        <h3>My Routines</h3>
        <div
          className={`${classes.Arrow} ${
            showRoutines ? 'ArrowDownWhite' : 'ArrowRightWhite'
          }`}
        ></div>
      </div>
      {showRoutines && routineLinks}
    </div>
  );
}
