import { Link } from 'react-router-dom';

import classes from '../../UserProfile.module.css';

const RoutineLink = (props) => {
  const deleteRoutineAndCloseModal = () => {
    props.toggleModal();
    props.deleteRoutine();
  };

  const displayModal = () => {
    props.setModalContent(
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
            onClick={props.toggleModal}
          >
            Cancel
          </button>
        </div>
      </>
    );
    props.toggleModal();
  };

  return (
    <div
      className={`${classes.RoutineLink} ${
        !props.isActiveRoutine && classes.ThreeBtnContainer
      }`}
    >
      <div className={classes.TopRow}>{props.title}</div>
      <div>
        <p>Number of workouts: {props.numberOfWorkouts}</p>

        {props.isActiveRoutine && <p>This is your current routine</p>}
      </div>
      <div
        className={
          props.isActiveRoutine ? classes.FlexRow : classes.ThreeBtnRow
        }
      >
        <button className={`GlobalBtn-2 ${classes.Btn}`} onClick={displayModal}>
          Delete routine
        </button>
        {!props.isActiveRoutine && (
          <button
            className={`GlobalBtn-2 ${classes.Btn}`}
            onClick={props.setActiveRoutine}
          >
            Set as current routine
          </button>
        )}
        <Link
          to={{
            pathname: `/create-routine/${props.title}`,
            state: { routine: props.routine },
          }}
        >
          <button className={`GlobalBtn-2 ${classes.Btn}`}>Edit routine</button>
        </Link>
      </div>
    </div>
  );
};

export default RoutineLink;
