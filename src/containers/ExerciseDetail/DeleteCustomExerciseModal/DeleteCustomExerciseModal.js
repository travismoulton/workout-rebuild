import { useSelector, useDispatch } from 'react-redux';

import Modal from '../../../components/UI/Modal/Modal';
import classes from '../ExerciseDetail.module.css';
import { exerciseDetailUtils as utils } from '../exerciseDetailUtils';
import {
  removeFavorite,
  selectFavoriteFirebaseId,
} from '../../../store/favoritesSlice';

export default function DeleteCustomExerciseModal(props) {
  const { exerciseId, history, show, closeModal, uid, firebaseSearchId } =
    props;

  const firebaseId = useSelector((state) =>
    selectFavoriteFirebaseId(state, exerciseId)
  );
  const isFavorite = firebaseId ? true : false;
  const dispatch = useDispatch();

  function deleteExerciseHandler() {
    if (isFavorite) dispatch(removeFavorite(uid, firebaseId));

    utils.deleteCustomExercise(uid, firebaseSearchId);

    closeModal();
    history.push('/search');
  }

  return (
    <Modal show={show} modalClosed={closeModal}>
      <p>Are you sure you want to delete this exercise?</p>
      <div className={classes.ModalBtnWrapper}>
        <button
          className={`GlobalBtn-1 ${classes.ConfirmBtn}`}
          onClick={deleteExerciseHandler}
        >
          Delete exercise
        </button>
        <button
          className={`GlobalBtn-1 ${classes.CancelBtn}`}
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
