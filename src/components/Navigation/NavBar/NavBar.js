import classes from './NavBar.module.css';
import NavItems from '../NavItems/NavItems';

export default function NavBar({ isAuthenticated, toggleSideBar }) {
  return (
    <header className={classes.Nav}>
      <nav className={`${classes.NavBar} ${classes.Desktop}`}>
        <NavItems isAuthenticated={isAuthenticated} />
      </nav>
    </header>
  );
}
