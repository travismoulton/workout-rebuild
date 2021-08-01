import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import Tooltip from '../../../components/UI/Tooltip/Tooltip';
import { removeExercise } from '../../../store/workoutSlice';
import classes from './RemoveExerciseBtn.module.css';

export default function RemoveWorkoutBtn({ id, exerciseName }) {
  const [tooltipData, setTooltipData] = useState({
    show: false,
    x: null,
    y: null,
  });
  const divRef = useRef(null);
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
      Remove {exerciseName} from workout
    </Tooltip>
  );

  return (
    <>
      <div
        ref={divRef}
        onMouseOver={showToolTip}
        onMouseOut={hideToolTip}
        className={classes.CloseWorkoutBtnContainer}
        onClick={() => dispatch(removeExercise(id))}
        onTouchStart={() => dispatch(removeExercise(id))}
      >
        <AiOutlineCloseCircle
          className={classes.CloseWorkoutBtn}
          size="1.5em"
        />
      </div>
      {tooltip}
    </>
  );
}
