import { Link } from 'react-router-dom';
import slugify from 'slugify';

import classes from '../../UserProfile.module.css';

const WorkoutLink = (props) => {
  const deleteWorkoutAndCloseModal = () => {
    props.toggleModal();
    props.deleteWorkout();
  };

  const deleteWorkoutRemoveFromRoutineAndCloseModal = () => {
    props.toggleModal();
    props.deleteWorkoutAndRemove();
  };

  const displayModal = () => {
    const modalContent = (
      <>
        <p>Are you sure you want to delete this workout?</p>
        {props.belongsToRoutine ? (
          <p>
            This workout belongs to a routine. If you delete it, it will be
            taken out of that routine. Do you wish to continue?
          </p>
        ) : null}
        <div className={classes.ModalBtnWrapper}>
          <button
            className={`GlobalBtn-1 ${classes.ModalBtn}`}
            onClick={
              props.belongsToRoutine
                ? deleteWorkoutRemoveFromRoutineAndCloseModal
                : deleteWorkoutAndCloseModal
            }
          >
            Yes
          </button>
          <button
            className={`GlobalBtn-1 ${classes.ModalBtn}`}
            onClick={props.toggleModal}
          >
            Cancel
          </button>
        </div>
      </>
    );
    props.setModalContent(modalContent);
    props.toggleModal();
  };

  return (
    <div className={classes.WorkoutLink}>
      <div className={classes.TopRow}>
        <p className={classes.Title}>
          <span>Workout name:</span> {props.title}
        </p>
      </div>
      <div className={`${classes.FlexRow} ${classes.Details}`}>
        {props.targetArea ? <p>Target Area: {props.targetArea}</p> : null}

        {props.secondaryTarget ? (
          <p>Secondary Target: {props.secondaryTarget}</p>
        ) : null}

        {props.exerciseCount ? (
          <p>Exercise Count: {props.exerciseCount}</p>
        ) : null}
      </div>
      <div className={`${classes.FlexRow} ${classes.BtnRow}`}>
        <Link
          to={{
            pathname: `/workout-detail/${slugify(props.title)}`,
            state: { workout: props.workout },
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
};

export default WorkoutLink;
