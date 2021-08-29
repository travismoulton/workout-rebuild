import { Link } from 'react-router-dom';
import slugify from 'slugify';

import classes from '../../UserProfile.module.css';

export default function WorkoutLink(props) {
  const {
    title,
    targetArea,
    secondaryTarget,
    exerciseCount,
    workout,
    belongsToRoutine,
    deleteWorkoutAndRemove,
    deleteWorkout,
    setModalContent,
    toggleModal,
  } = props;

  const deleteWorkoutAndCloseModal = () => {
    toggleModal();
    deleteWorkout();
  };

  const deleteWorkoutRemoveFromRoutineAndCloseModal = () => {
    toggleModal();
    deleteWorkoutAndRemove();
  };

  const displayModal = () => {
    const modalContent = (
      <>
        <p>Are you sure you want to delete this workout?</p>
        {belongsToRoutine && (
          <p>
            This workout belongs to a routine. If you delete it, it will be
            taken out of that routine. Do you wish to continue?
          </p>
        )}
        <div className={classes.ModalBtnWrapper}>
          <button
            className={`GlobalBtn-1 ${classes.ModalBtn}`}
            onClick={
              belongsToRoutine
                ? deleteWorkoutRemoveFromRoutineAndCloseModal
                : deleteWorkoutAndCloseModal
            }
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
    setModalContent(modalContent);
    toggleModal();
  };

  return (
    <div className={classes.WorkoutLink}>
      <div className={classes.TopRow}>
        <p className={classes.Title}>
          <span>Workout name:</span> {title}
        </p>
      </div>
      <div className={`${classes.FlexRow} ${classes.Details}`}>
        {targetArea && <p>Target Area: {targetArea}</p>}

        {secondaryTarget && <p>Secondary Target: {secondaryTarget}</p>}

        {exerciseCount && <p>Exercise Count: {exerciseCount}</p>}
      </div>
      <div className={`${classes.FlexRow} ${classes.BtnRow}`}>
        <Link
          to={{
            pathname: `/workout-detail/${slugify(title)}`,
            state: { workout: workout },
          }}
        >
          <button className={`GlobalBtn-2 ${classes.Btn}`}>Edit workout</button>
        </Link>
        <button className={`GlobalBtn-2 ${classes.Btn}`} onClick={displayModal}>
          Delete workout
        </button>
      </div>
    </div>
  );
}
