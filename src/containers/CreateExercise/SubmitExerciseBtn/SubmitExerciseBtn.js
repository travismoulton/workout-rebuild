import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';

import { submitExerciseBtnUtils as utils } from './submitExerciseBtnUtils';
import Tooltip from '../../../components/UI/Tooltip/Tooltip';
import classes from './SubmitExerciseBtn.module.css';

export default function SubmitExerciseBtn(props) {
  const {
    formIsValid,
    description,
    title,
    nameIsValid,
    categoryIsValid,
    primaryMuscles,
    equipment,
    secondaryMuscles,
    category,
  } = props;

  const [error, setError] = useState({ isError: false, code: '', msg: '' });
  const [tooltipData, setTooltipData] = useState({
    show: false,
    x: null,
    y: null,
    innerTxt: null,
  });
  const { uid, accessToken } = useSelector((state) => state.auth);
  const history = useHistory();

  const axiosError = {
    isError: true,
    code: 'axios',
    msg: (
      <p style={{ color: 'red' }}>
        Sorry, something went wrong. Please try again
      </p>
    ),
  };

  const nameTakenError = {
    isError: true,
    msg: (
      <p style={{ color: 'red' }}>
        That name is already taken, please try a different name
      </p>
    ),
    code: 'nameTaken',
    takenName: title,
  };

  useEffect(() => {
    if (error) if (error.takenName && error.takenName !== title) setError(null);
  }, [error, title]);

  const exerciseData = {
    name: title,
    description,
    category,
    muscles: primaryMuscles,
    equipment,
    muscles_secondary: secondaryMuscles,
    id: `custom-${nanoid()}`,
  };

  const submitValidFormHandler = async () => {
    const nameTaken = await utils
      .checkForPreviousNameUse(uid, accessToken, title)
      .catch((err) => setError(axiosError));

    if (nameTaken) {
      setError(nameTakenError);
      return;
    }

    if (error.code !== 'axios')
      await utils
        .submitExercise(uid, accessToken, exerciseData)
        .catch((err) => setError(axiosError));

    history.push('/my-profile');
  };

  const createTooltipInnerTxt = () => {
    if (!nameIsValid && !categoryIsValid) {
      return <p>Name and category are required to create an exercise</p>;
    } else if (nameIsValid && !categoryIsValid) {
      return <p>Category is required to create an exercise</p>;
    } else if (!nameIsValid && categoryIsValid) {
      return <p>Name is required to create an exercise</p>;
    }
  };

  const tooltip = tooltipData.show && (
    <Tooltip x={tooltipData.x} y={tooltipData.y}>
      {createTooltipInnerTxt()}
    </Tooltip>
  );

  const showToolTip = (e) => {
    if (!formIsValid) {
      const btnCoordinateData = e.target.getBoundingClientRect();
      setTooltipData({
        show: true,
        x: btnCoordinateData.x + btnCoordinateData.width / 2 + 'px',
        y: btnCoordinateData.y - btnCoordinateData.height - 10 + 'px',
      });
    }
  };

  const hideToolTip = () =>
    setTooltipData({ show: false, x: null, y: null, innerTxt: null });

  return (
    <>
      {error.isError && error.msg}
      <button
        className={`GlobalBtn-1 ${classes.Btn}`}
        disabled={!formIsValid}
        onClick={submitValidFormHandler}
        onMouseOver={showToolTip}
        onMouseOut={hideToolTip}
      >
        Submit Exercise
      </button>

      {tooltip}
    </>
  );
}
