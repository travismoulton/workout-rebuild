import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Modal from '../../../components/UI/Modal/Modal';
import classes from '../ExerciseDetail.module.css';
import { exerciseDetailUtils as utils } from '../exerciseDetailUtils';
import {
  removeFavorite,
  selectFavoriteFirebaseId,
} from '../../../store/favoritesSlice';

export default function DeleteCustomExerciseModal(props) {
  const { exerciseId, show, closeModal, firebaseSearchId } = props;

  const firebaseId = useSelector((state) =>
    selectFavoriteFirebaseId(state, exerciseId)
  );
  const isFavorite = firebaseId ? true : false;
  const { uid, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();

  function deleteExerciseHandler() {
    if (isFavorite) dispatch(removeFavorite(uid, firebaseId));

    utils.deleteCustomExercise(uid, accessToken, firebaseSearchId);

    closeModal();
    history.push('/search');
  }

  return (
    <Modal show={show} modalClosed={closeModal} testId="deleteExerciseModal">
      <p>Are you sure you want to delete this exercise?</p>
      <div className={classes.ModalBtnWrapper}>
        <button
          data-testid="deleteExerciseBtn"
          className={`GlobalBtn-1 ${classes.ConfirmBtn}`}
          onClick={deleteExerciseHandler}
        >
          Delete exercise
        </button>
        <button
          data-testid="cancelBtn"
          className={`GlobalBtn-1 ${classes.CancelBtn}`}
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
