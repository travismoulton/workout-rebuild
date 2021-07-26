import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import axios from 'axios';

import Tooltip from '../../../components/UI/Tooltip/Tooltip';
import classes from './SubmitExerciseBtn.module.css';

const SubmitExerciseBtn = (props) => {
  const [error, setError] = useState({ isError: false, code: '', msg: '' });
  const [tooltipData, setTooltipData] = useState({
    show: false,
    x: null,
    y: null,
    innerTxt: null,
  });
  const { uid, accessToken } = useSelector((state) => state.auth);

  const axiosError = {
    ...error,
    isError: true,
    code: 'axios',
    msg: (
      <p style={{ color: 'red' }}>
        Sorry, something went wrong. Please try again
      </p>
    ),
  };

  const nameTakenError = {
    ...error,
    isError: true,
    msg: (
      <p style={{ color: 'red' }}>
        That name is already taken, please try a different name
      </p>
    ),
    code: 'nameTaken',
    takenName: props.title,
  };

  useEffect(() => {
    if (error)
      if (error.takenName && error.takenName !== props.title) setError(null);
  }, [error, props.title]);

  const checkForPreviousNameUse = async () => {
    let nameTaken = false;
    await axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${uid}.json?auth=${accessToken}`,
        { timeout: 5000 }
      )
      .then((res) => {
        for (const key in res.data) {
          if (res.data[key].name === props.title) {
            setError(nameTakenError);
            nameTaken = true;
            break;
          }
        }
      })
      .catch((err) => {
        setError(axiosError);
      });

    return nameTaken;
  };

  const exerciseData = {
    name: props.title,
    description: props.description,
    category: props.category,
    muscles: props.primaryMuscle,
    equipment: props.equipment,
    muscles_secondary: props.secondaryMuscles,
    id: `$custom-${nanoid()}`,
  };

  const submitValidFormHandler = async () => {
    if (await checkForPreviousNameUse()) return;

    axios({
      method: 'post',
      url: `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${uid}.json?auth=${accessToken}`,
      timeout: 5000,
      data: exerciseData,
    })
      .then(() => {
        props.history.push(`/my-profile`);
      })
      .catch((err) => {
        setError(axiosError);
      });
  };

  const createTooltipInnerTxt = () => {
    if (!props.nameIsValid && !props.categoryIsValid) {
      return <p>Name and category are required to create an exercise</p>;
    } else if (props.nameIsValid && !props.categoryIsValid) {
      return <p>Category is required to create an exercise</p>;
    } else if (!props.nameIsValid && props.categoryIsValid) {
      return <p>Name is required to create an exercise</p>;
    }
  };

  const tooltip = tooltipData.show ? (
    <Tooltip x={tooltipData.x} y={tooltipData.y}>
      {createTooltipInnerTxt()}
    </Tooltip>
  ) : null;

  const showToolTip = (e) => {
    if (!props.formIsValid) {
      const btnCoordinateData = e.target.getBoundingClientRect();
      setTooltipData({
        show: true,
        x: btnCoordinateData.x + btnCoordinateData.width / 2 + 'px',
        y: btnCoordinateData.y - btnCoordinateData.height - 10 + 'px',
      });
    }
  };

  const hideToolTip = () => {
    setTooltipData({ show: false, x: null, y: null, innerTxt: null });
  };

  return (
    <>
      {error.isError && error.msg}
      <button
        className={`GlobalBtn-1 ${classes.Btn}`}
        disabled={!props.formIsValid}
        onClick={submitValidFormHandler}
        onMouseOver={showToolTip}
        onMouseOut={hideToolTip}
      >
        Submit Exercise
      </button>

      {tooltip}
    </>
  );
};

export default SubmitExerciseBtn;
