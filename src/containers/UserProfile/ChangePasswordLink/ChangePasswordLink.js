import { Link } from 'react-router-dom';

import classes from '../UserProfile.module.css';

const ChangePasswordLink = () => (
  <div className={`${classes.Header} ${classes.UpdatePasswordLink}`}>
    <Link className={classes.Link} to="/update-password">
      <h3> Update My Password</h3>
    </Link>
  </div>
);

export default ChangePasswordLink;
