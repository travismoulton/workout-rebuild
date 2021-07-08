import { NavLink } from 'react-router-dom';

import classes from './NavItem.module.css';

export default function NavItem({ link, children }) {
  return (
    <li className={classes.NavItem}>
      <NavLink activeClassName={classes.active} exact to={link}>
        {children}
      </NavLink>
    </li>
  );
}
