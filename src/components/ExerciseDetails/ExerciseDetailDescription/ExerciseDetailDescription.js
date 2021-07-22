import { MdDescription } from 'react-icons/md';

import classes from '../ExerciseDetail.module.css';

const ExerciseDetailDescription = ({ description }) => (
  <div className={`${classes.Detail} ${classes.Description}`}>
    <h3>
      Description <MdDescription />
    </h3>
    <div dangerouslySetInnerHTML={{ __html: description }}></div>
  </div>
);

export default ExerciseDetailDescription;
