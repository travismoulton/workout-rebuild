import { MdDescription } from 'react-icons/md';

import classes from '../ExerciseDetail.module.css';

const ExerciseDetailDescription = ({ description }) =>
  description ? (
    <div className={`${classes.Detail} ${classes.Description}`}>
      <h3>
        Description <MdDescription />
      </h3>
      <div dangerouslySetInnerHTML={{ __html: description }}></div>
    </div>
  ) : null;

export default ExerciseDetailDescription;
