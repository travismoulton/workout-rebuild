import classes from './Tooltip.module.css';

const Tooltip = ({ x, y, children }) => (
  <div className={classes.Tooltip} style={{ left: x, top: y }}>
    {children}
  </div>
);

export default Tooltip;
