import { Link } from 'react-router-dom';

import classes from '../../UserProfile.module.css';

export default function RoutineLink(props) {
  const {
    title,
    setActiveRoutine,
    numberOfWorkouts,
    isActiveRoutine,
    deleteRoutine,
    routine,
    setModalContent,
    toggleModal,
  } = props;

  const deleteRoutineAndCloseModal = () => {
    toggleModal();
    deleteRoutine();
  };

  const displayModal = () => {
    setModalContent(
      <>
        <p>Are you sure you want to delete this routine?</p>
        <div className={classes.ModalBtnWrapper}>
          <button
            className={`GlobalBtn-1 ${classes.ModalBtn}`}
            onClick={deleteRoutineAndCloseModal}
          >
            Yes
          </button>
          <button
            className={`GlobalBtn-1 ${classes.ModalBtn}`}
            onClick={toggleModal}
          >
            Cancel
          </button>
        </div>
      </>
    );
    toggleModal();
  };

  return (
    <div
      className={`${classes.RoutineLink} ${
        !isActiveRoutine && classes.ThreeBtnContainer
      }`}
    >
      <div className={classes.TopRow}>{title}</div>
      <div>
        <p>Number of workouts: {numberOfWorkouts}</p>

        {isActiveRoutine && <p>This is your current routine</p>}
      </div>
      <div className={isActiveRoutine ? classes.FlexRow : classes.ThreeBtnRow}>
        <button className={`GlobalBtn-2 ${classes.Btn}`} onClick={displayModal}>
          Delete routine
        </button>
        {!isActiveRoutine && (
          <button
            className={`GlobalBtn-2 ${classes.Btn}`}
            onClick={setActiveRoutine}
          >
            Set as current routine
          </button>
        )}
        <Link
          to={{
            pathname: `/create-routine/${title}`,
            state: { routine: routine },
          }}
        >
          <button className={`GlobalBtn-2 ${classes.Btn}`}>Edit routine</button>
        </Link>
      </div>
    </div>
  );
}
