import classes from './DecrementBtn.module.css';

const DecrementBtn = (props) => (
  <button className={classes.DecrementBtn} onClick={props.clicked}>
    -
  </button>
);

export default DecrementBtn;
