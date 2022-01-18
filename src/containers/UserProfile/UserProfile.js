import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Workouts from './Workouts/Workouts';
import Routines from './Routines/Routines';
import RecordedWorkouts from './RecordedWorkouts/RecordedWorkouts';
import ChangePasswordLink from './ChangePasswordLink/ChangePasswordLink';
import Modal from '../../components/UI/Modal/Modal';
import Message from './Message/Message';

export default function UserProfile({ history }) {
  const { user } = useSelector((state) => state.auth);

  const [workoutsShowing, setWorkoutsShowing] = useState(false);
  const [routinesShowing, setRoutinesShowing] = useState(false);
  const [recordedWorkoutsShowing, setRecordedWorkoutsShowing] = useState(false);
  const [showMessage, setShowMessage] = useState(null);
  const [messageFinished, setMessageFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [error, setError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        Sorry, something went wrong. Please refresh the page and try again or
        come back later.
      </p>
    ),
  });

  useEffect(() => {
    document.title = 'My Profile';
  }, []);

  useEffect(() => {
    if (history.location.state && !messageFinished && !showMessage) {
      const { message } = history.location.state;
      setShowMessage(<Message messageText={message} show />);
    }
  }, [showMessage, messageFinished, history.location.state]);

  useEffect(() => {
    let timer;
    if (showMessage) {
      const { message } = history.location.state;
      timer = setTimeout(() => {
        setShowMessage(<Message messageText={message} />);
        setMessageFinished(true);
      }, 2000);
    }

    return timer ? () => clearTimeout(timer) : null;
  }, [showMessage, history.location.state]);

  const triggerWorkoutsShowing = () => {
    setWorkoutsShowing(workoutsShowing ? false : true);
    if (routinesShowing) setRoutinesShowing(false);
    if (recordedWorkoutsShowing) setRecordedWorkoutsShowing(false);
  };

  const triggerRoutinesShowing = () => {
    setRoutinesShowing(routinesShowing ? false : true);
    if (workoutsShowing) setWorkoutsShowing(false);
    if (recordedWorkoutsShowing) setRecordedWorkoutsShowing(false);
  };

  const triggerRecordedWorkoutsShowing = () => {
    setRecordedWorkoutsShowing(recordedWorkoutsShowing ? false : true);
    if (workoutsShowing) setWorkoutsShowing(false);
    if (routinesShowing) setRoutinesShowing(false);
  };

  const modal = (
    <Modal show={showModal} modalClosed={() => setShowModal(false)}>
      {modalContent}
    </Modal>
  );

  useEffect(() => {
    let timer;
    if (!showModal && modalContent)
      timer = setTimeout(() => {
        setModalContent(null);
      }, 500);

    return timer ? clearTimeout(timer) : null;
  }, [showModal, modalContent]);

  return (
    <>
      {error.isError && error.message}

      {showMessage}

      <Workouts
        setModalContent={(jsx) => setModalContent(jsx)}
        toggleModal={() => setShowModal((prevShowModal) => !prevShowModal)}
        triggerWorkoutsShowing={triggerWorkoutsShowing}
        showWorkouts={workoutsShowing}
        toggleError={() => setError({ ...error, isError: true })}
        isError={error.isError}
      />

      <Routines
        setModalContent={(jsx) => setModalContent(jsx)}
        toggleModal={() => setShowModal((prevShowModal) => !prevShowModal)}
        triggerRoutinesShowing={triggerRoutinesShowing}
        showRoutines={routinesShowing}
        toggleError={() => setError({ ...error, isError: true })}
        isError={error.isError}
      />
      <RecordedWorkouts
        setModalContent={(jsx) => setModalContent(jsx)}
        toggleModal={() => setShowModal((prevShowModal) => !prevShowModal)}
        triggerRecordedWorkoutsShowing={triggerRecordedWorkoutsShowing}
        showRecordedWorkouts={recordedWorkoutsShowing}
        toggleError={() => setError({ ...error, isError: true })}
        isError={error.isError}
      />
      {/* Do not display ChangePasswordLink for the common guest account */}
      {user.email !== 'commonguest@guest.com' && <ChangePasswordLink />}

      {modal}
    </>
  );
}
