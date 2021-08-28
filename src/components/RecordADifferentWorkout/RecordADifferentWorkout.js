import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { recordADifferentWorkoutUtils as utils } from './recordADifferentWorkoutUtils';
import Modal from '../UI/Modal/Modal';
import Input from '../UI/Input/Input';
import classes from './RecordADifferentWorkout.module.css';

export default function RecordADifferentWorkout(props) {
  const { switchWorkout, closeModal, show } = props;

  const [axiosError, setAxiosError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        We're having trouble loading your workouts. Try re-freshing the page or
        come back later
      </p>
    ),
  });
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [routineWorkouts, setRoutineWorkouts] = useState([]);
  const [initialRoutineMenuSet, setIntialRoutineMenuSet] = useState(false);
  const [initalWorkoutMenuSet, setInitialWorkoutMenuSet] = useState(false);
  const [activeRoutineSelectMenu, setActiveRoutineSelectMenu] = useState({
    elementType: 'select',
    elementConfig: {
      options: [],
    },
    value: '',
    displayValue: '',
    validation: {
      required: false,
    },
    valid: true,
  });
  const [allWorkoutSelectMenu, setAllWorkoutSelectMenu] = useState({
    elementType: 'select',
    elementConfig: {
      options: [],
    },
    value: '',
    displayValue: '',
    validation: {
      required: false,
    },
    valid: true,
  });
  const { activeRoutine } = useSelector((state) => state.favorites);
  const { uid, accessToken } = useSelector((state) => state.auth);

  const { fetchAllWorkouts, fetchWorkoutById } = utils;

  const prepareAllWorkouts = useCallback(() => {
    fetchAllWorkouts(uid, accessToken)
      .then(({ data }) => {
        if (data) {
          const workouts = [];
          for (const key in data)
            workouts.push({ ...data[key], firebaseId: key });
          setAllWorkouts(workouts);
        }
      })
      .catch(() => {
        setAxiosError({
          ...axiosError,
          isError: true,
        });
      });
  }, [axiosError, fetchAllWorkouts, uid, accessToken]);

  const prepareRoutineWorkouts = useCallback(async () => {
    if (activeRoutine) {
      const workoutIds = activeRoutine.workouts.filter(
        (workout) => workout !== 'Rest'
      );

      const workouts = [];

      for (let i = 0; i < workoutIds.length; i++) {
        await fetchWorkoutById(uid, accessToken, workoutIds[i])
          .then(({ data }) => {
            workouts.push({ ...data, firebaseId: workoutIds[i] });
          })
          .catch(() => {
            setAxiosError({
              ...axiosError,
              isError: true,
            });
          });
      }
      setRoutineWorkouts(workouts);
    }
  }, [activeRoutine, uid, axiosError, accessToken, fetchWorkoutById]);

  useEffect(() => {
    if (!initalWorkoutMenuSet && !initialRoutineMenuSet) {
      prepareRoutineWorkouts();
      prepareAllWorkouts();
    }
  }, [
    prepareRoutineWorkouts,
    prepareAllWorkouts,
    initialRoutineMenuSet,
    initalWorkoutMenuSet,
  ]);

  const filterMenuOptions = (unfilteredOptions) => {
    const filteredOptions = [];

    unfilteredOptions.forEach((unfiltered) => {
      !filteredOptions.filter((filtered) => filtered.label === unfiltered.label)
        .length && filteredOptions.push(unfiltered);
    });

    return filteredOptions;
  };

  useEffect(() => {
    if (routineWorkouts.length && !initialRoutineMenuSet) {
      const menuOptions = routineWorkouts.map((workout) => ({
        value: workout.firebaseId,
        label: workout.title,
      }));

      setActiveRoutineSelectMenu({
        ...activeRoutineSelectMenu,
        elementConfig: {
          ...activeRoutineSelectMenu.elementConfig,
          options: [
            { value: '', label: '' },
            ...filterMenuOptions(menuOptions),
          ],
        },
      });
      setIntialRoutineMenuSet(true);
    }
  }, [routineWorkouts, initialRoutineMenuSet, activeRoutineSelectMenu]);

  useEffect(() => {
    if (allWorkouts.length && !initalWorkoutMenuSet) {
      const menuOptions = allWorkouts.map((workout) => ({
        value: workout.firebaseId,
        label: workout.title,
      }));

      setAllWorkoutSelectMenu({
        ...allWorkoutSelectMenu,
        elementConfig: {
          ...allWorkoutSelectMenu.elementConfig,
          options: [{ value: '', label: '' }, ...menuOptions],
        },
      });
      setInitialWorkoutMenuSet(true);
    }
  }, [allWorkouts, initalWorkoutMenuSet, allWorkoutSelectMenu]);

  const routineBasedInput = (
    <Input
      label={'Choose from active routine'}
      selectId={'activeRoutine'}
      value={activeRoutineSelectMenu.displayValue}
      elementConfig={activeRoutineSelectMenu.elementConfig}
      elementType={activeRoutineSelectMenu.elementType}
      changed={(e) =>
        setActiveRoutineSelectMenu({
          ...activeRoutineSelectMenu,
          displayValue: activeRoutineSelectMenu.elementConfig.options.filter(
            (option) => option.value === e.value
          )[0],
          value: e.value,
        })
      }
      classname="RecordWorkoutModalSelect"
      wrapperClass="RecordWorkoutModalSelectWrapper"
      notSearchable
    />
  );

  const workoutBasedInput = (
    <Input
      label="Choose from all your workouts"
      selectId={'allWorkouts'}
      value={allWorkoutSelectMenu.displayValue}
      elementConfig={allWorkoutSelectMenu.elementConfig}
      elementType={allWorkoutSelectMenu.elementType}
      changed={(e) =>
        setAllWorkoutSelectMenu({
          ...allWorkoutSelectMenu,
          displayValue: allWorkoutSelectMenu.elementConfig.options.filter(
            (option) => option.value === e.value
          )[0],
          value: e.value,
        })
      }
      classname="RecordWorkoutModalSelect"
      wrapperClass="RecordWorkoutModalSelectWrapper"
      notSearchable
    />
  );

  const switchWorkoutAndCloseModal = (menu) => {
    if (menu === 'routine') {
      switchWorkout(activeRoutineSelectMenu.value);
      setActiveRoutineSelectMenu({
        ...activeRoutineSelectMenu,
        displayValue: null,
      });
    } else if (menu === 'allWorkouts') {
      switchWorkout(allWorkoutSelectMenu.value);
      setAllWorkoutSelectMenu({ ...allWorkoutSelectMenu, displayValue: null });
      console.log('switchWorkoutAndCloseModal');
    }
    closeModal();
  };

  const switchWorkoutBtn = (menu) => (
    <button
      className={`GlobalBtn-1`}
      onClick={() => switchWorkoutAndCloseModal(menu)}
    >
      Choose workout
    </button>
  );

  const noAvailableWorkoutsMsg = (
    <p>
      You have no workouts available. Go to &nbsp;
      <Link to="/create-workout">Create Workout</Link> To make one now
    </p>
  );

  const modal = (
    <Modal show={show} modalClosed={closeModal}>
      {activeRoutineSelectMenu.elementConfig.options.length ? (
        <div className={classes.MenuGrouping}>
          {routineBasedInput}
          {switchWorkoutBtn('routine')}
        </div>
      ) : null}
      {allWorkoutSelectMenu.elementConfig.options.length ? (
        <div className={classes.MenuGrouping}>
          {workoutBasedInput}
          {switchWorkoutBtn('allWorkouts')}
        </div>
      ) : null}
      {!activeRoutineSelectMenu.elementConfig.options.length &&
      !allWorkoutSelectMenu.elementConfig.options.length
        ? noAvailableWorkoutsMsg
        : null}
      <button
        className={`GlobalBtn-1 ${classes.CancelBtn}`}
        onClick={closeModal}
      >
        Cancel
      </button>
    </Modal>
  );

  return axiosError.isError ? axiosError.message : modal;
}
