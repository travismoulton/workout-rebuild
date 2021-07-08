import NavBar from '../Navigation/NavBar/NavBar';
import classes from './Layout.module.css';

export default function Layout({ isAuthenticated, children }) {
  return (
    <>
      <NavBar isAuthenticated={isAuthenticated} />
      <main data-testid="Main" className={classes.Main}>
        {children}
      </main>
    </>
  );
}
