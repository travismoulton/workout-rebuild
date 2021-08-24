import { useState } from 'react';

import Modal from '../../../components/UI/Modal/Modal';
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import classes from './ChangeWorkoutRecordDate.module.css';

export default function ChangeWorkoutRecordDate(props) {
  const { changeDate, closeModal, show } = props;

  const [date, setDate] = useState(new Date());

  const selectNewDate = () => {
    const dateStr = date.toISOString().split('-');
    changeDate(
      new Date(+dateStr[0], --dateStr[1], +dateStr[2].substring(0, 2))
    );
  };

  const changeDateAndCloseModal = () => {
    selectNewDate();
    closeModal();
  };

  const changeDateBtn = (
    <button
      className={`GlobalBtn-1 ${classes.Btn}`}
      onClick={changeDateAndCloseModal}
    >
      Change Date
    </button>
  );

  const cancelBtn = (
    <button className={`GlobalBtn-1 ${classes.Btn}`} onClick={closeModal}>
      Cancel
    </button>
  );

  return (
    <Modal show={show} modalClosed={closeModal}>
      <div className={classes.Container}>
        <DatePicker onChange={(date) => setDate(date)} />
        <div className={classes.BtnRow}>
          {changeDateBtn}
          {cancelBtn}
        </div>
      </div>
    </Modal>
  );
}
