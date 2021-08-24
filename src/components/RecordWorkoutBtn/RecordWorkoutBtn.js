import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { recordWorkoutBtnUtils as utils } from './recordWorkoutBtnUtils';
import classes from './RecordWorkoutBtn.module.css';
import Modal from '../UI/Modal/Modal';

export default function RecordWorkoutBtn(props) {
  const { date, updateWorkoutInFirebase, updated, exercises, workout } = props;

  const [showModal, setShowModal] = useState(false);
  const [axiosError, setAxiosError] = useState({
    isError: null,
    message: (
      <p style={{ color: 'red' }}>
        We're having trouble recording your workout. Please try again
      </p>
    ),
  });
  const { uid, accessToken } = useSelector((state) => state.auth);
  const history = useHistory();

  const recordWorkoutHandler = async () => {
    const workoutData = {
      exercises: exercises,
      title: workout.title,
      date: {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
      },
    };

    utils
      .submitRecordedWorkout(uid, accessToken, workoutData)
      .then(() => {
        history.push({
          pathname: '/my-profile',
          state: { message: 'Workout Recorded' },
        });
      })
      .catch(() => setAxiosError({ ...axiosError, isError: true }));
  };

  const closeModalAndSaveWorkout = async () => {
    setShowModal(false);
    await updateWorkoutInFirebase();
    recordWorkoutHandler();
  };

  const closeModalWithoutSavingWorkout = () => {
    setShowModal(false);
    recordWorkoutHandler();
  };

  const modal = (
    <Modal show={showModal} modalClosed={() => setShowModal(false)}>
      <p>
        You made changes to this workout. Would you like to make theses changes
        permanant?
      </p>
      <div className={classes.ModalBtnWrapper}>
        <button
          className={`GlobalBtn-1 ${classes.ModalBtn}`}
          onClick={closeModalAndSaveWorkout}
        >
          Yes
        </button>
        <button
          className={`GlobalBtn-1 ${classes.ModalBtn}`}
          onClick={closeModalWithoutSavingWorkout}
        >
          No
        </button>
        <button
          className={`GlobalBtn-1 ${classes.ModalBtn}`}
          onClick={() => setShowModal(false)}
        >
          Go back
        </button>
      </div>
    </Modal>
  );
  return (
    <>
      {modal}
      <button
        className={`GlobalBtn-1 ${classes.Btn}`}
        onClick={updated ? () => setShowModal(true) : recordWorkoutHandler}
      >
        Record workout
      </button>
      {axiosError.isError ? axiosError.message : null}
    </>
  );
}
