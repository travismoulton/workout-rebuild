import classes from './IncrementBtn.module.css';

const IncrementBtn = ({ clicked }) => (
  <button className={classes.IncrementBtn} onClick={clicked}>
    +
  </button>
);

export default IncrementBtn;
