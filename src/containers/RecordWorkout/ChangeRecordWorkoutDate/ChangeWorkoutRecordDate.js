import { useState } from 'react';

import Modal from '../../../components/UI/Modal/Modal';
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import classes from './ChangeWorkoutRecordDate.module.css';

const ChangeWorkoutRecordDate = (props) => {
  const [date, setDate] = useState(new Date());

  const selectNewDate = () => {
    const dateStr = date.toISOString().split('-');
    props.changeDate(
      new Date(+dateStr[0], --dateStr[1], +dateStr[2].substring(0, 2))
    );
  };

  const changeDateAndCloseModal = () => {
    selectNewDate();
    props.closeModal();
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
    <button className={`GlobalBtn-1 ${classes.Btn}`} onClick={props.closeModal}>
      Cancel
    </button>
  );

  return (
    <Modal show={props.show} modalClosed={props.closeModal}>
      <div className={classes.Container}>
        <DatePicker onChange={(date) => setDate(date)} />
        <div className={classes.BtnRow}>
          {changeDateBtn}
          {cancelBtn}
        </div>
      </div>
    </Modal>
  );
};

export default ChangeWorkoutRecordDate;
