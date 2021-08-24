import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import classes from './RecordWorkoutBtn.module.css';
import Modal from '../UI/Modal/Modal';

const RecordWorkoutBtn = (props) => {
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

  const recordWorkoutHandler = async () => {
    axios({
      method: 'post',
      url: `https://workout-81691-default-rtdb.firebaseio.com/recordedWorkouts/${uid}.json?auth=${accessToken}`,
      timeout: 5000,
      data: {
        exercises: props.exercises,
        title: props.workout.title,
        date: {
          year: props.date.getFullYear(),
          month: props.date.getMonth(),
          day: props.date.getDate(),
        },
      },
    })
      .then(() => {
        props.history.push({
          pathname: '/my-profile',
          state: { message: 'Workout Recorded' },
        });
      })
      .catch((err) => setAxiosError({ ...axiosError, isError: true }));
  };

  const closeModalAndSaveWorkout = async () => {
    setShowModal(false);
    await props.updateWorkoutInFirebase();
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
        onClick={
          props.updated ? () => setShowModal(true) : recordWorkoutHandler
        }
      >
        Record workout
      </button>
      {axiosError.isError ? axiosError.message : null}
    </>
  );
};

export default RecordWorkoutBtn;
