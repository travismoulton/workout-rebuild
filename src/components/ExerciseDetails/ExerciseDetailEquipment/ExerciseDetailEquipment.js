import { GiWeightLiftingUp } from 'react-icons/gi';

import classes from '../ExerciseDetail.module.css';

const ExerciseDetailEquipment = ({ equipment }) => {
  const equipmentListItems = equipment.map((el) => <li key={el}>{el}</li>);

  return equipmentListItems.length ? (
    <div className={`${classes.Detail} ${classes.Equipment}`}>
      <h3>
        Equipment <GiWeightLiftingUp />
      </h3>
      <ul data-testid="equipmentList">{equipment}</ul>
    </div>
  ) : (
    <></>
  );
};

export default ExerciseDetailEquipment;
