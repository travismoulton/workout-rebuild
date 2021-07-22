import { BsClipboard } from 'react-icons/bs';

import classes from '../ExerciseDetail.module.css';

const ExerciseDetailCategory = ({ category }) => (
  <div className={`${classes.Detail} ${classes.Category}`}>
    <h3>
      Category <BsClipboard />
    </h3>
    <div>
      <p>{category}</p>
    </div>
  </div>
);

export default ExerciseDetailCategory;
