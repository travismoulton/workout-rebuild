import classes from './NavBar.module.css';
import NavItems from '../NavItems/NavItems';
import DrawerToggle from '../DrawerToggle/DrawerToggle';

export default function NavBar({ isAuthenticated, toggleSideBar }) {
  return (
    <header className={classes.Nav}>
      <nav
        data-testid="NavBar"
        className={`${classes.NavBar} ${classes.Desktop}`}
      >
        <NavItems isAuthenticated={isAuthenticated} />
      </nav>
      <DrawerToggle clicked={toggleSideBar} />
    </header>
  );
}
