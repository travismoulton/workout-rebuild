import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import Tooltip from '../../../components/UI/Tooltip/Tooltip';
import { removeExercise } from '../../../store/workoutSlice';
import classes from './RemoveExerciseBtn.module.css';

const RemoveWorkoutBtn = (props) => {
  const [tooltipData, setTooltipData] = useState({
    show: false,
    x: null,
    y: null,
  });
  const divRef = useRef(null);
  const { exercises } = useSelector((state) => state.workout);
  const dispatch = useDispatch();

  const showToolTip = (e) => {
    const btnCoordinateData = divRef.current.getBoundingClientRect();

    setTooltipData({
      show: true,
      x: btnCoordinateData.x + btnCoordinateData.width / 2 + 'px',
      y: btnCoordinateData.y - btnCoordinateData.height - 10 + 'px',
    });
  };

  const hideToolTip = () => setTooltipData({ show: false, x: null, y: null });

  const tooltip = tooltipData.show && (
    <Tooltip x={tooltipData.x} y={tooltipData.y}>
      Remove {props.exerciseName} from workout
    </Tooltip>
  );

  return (
    <>
      <div
        ref={divRef}
        onMouseOver={showToolTip}
        onMouseOut={hideToolTip}
        className={classes.CloseWorkoutBtnContainer}
        onClick={() => dispatch(removeExercise(exercises, props.id))}
        onTouchStart={() => dispatch(removeExercise(exercises, props.id))}
      >
        <AiOutlineCloseCircle
          className={classes.CloseWorkoutBtn}
          size="1.5em"
        />
      </div>
      {tooltip}
    </>
  );
};

export default RemoveWorkoutBtn;
