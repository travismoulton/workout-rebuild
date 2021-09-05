import NavItems from '../NavItems/NavItems';
import Backdrop from '../../UI/Backdrop/Backdrop';
import classes from './SideBar.module.css';

export default function SideBar({ show, closed, isAuthenticated }) {
  const style = show
    ? [classes.SideBar, classes.Open]
    : [classes.SideBar, classes.Closed];

  return (
    <>
      <Backdrop show={show} clicked={closed} />
      <div className={style.join(' ')} onClick={closed}>
        <nav className={classes.Nav}>
          <NavItems isAuthenticated={isAuthenticated} inSideBar />
        </nav>
      </div>
    </>
  );
}
