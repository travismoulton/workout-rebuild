import classes from './IncrementBtn.module.css';

const IncrementBtn = (props) => (
  <button className={classes.IncrementBtn} onClick={props.clicked}>
    +
  </button>
);

export default IncrementBtn;
