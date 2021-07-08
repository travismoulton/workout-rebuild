import React from 'react';
import classes from './Spinner.module.css';

const Spinner = () => (
  <div data-testid="Spinner" className={classes.Loader}>
    Loading...
  </div>
);

export default Spinner;
