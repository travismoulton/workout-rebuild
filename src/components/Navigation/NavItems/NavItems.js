import NavItem from './NavItem/NavItem';
import classes from './NavItems.module.css';

export default function NavItems({ isAuthenticated }) {
  return (
    <ul data-testid="NavItems" className={classes.NavItems}>
      <NavItem link="/search">Search</NavItem>
      {isAuthenticated ? (
        <>
          <NavItem link="/my-profile">My Profile</NavItem>
          <NavItem link="/create-workout">Create Workout</NavItem>
          <NavItem link="/create-routine">Create Routine</NavItem>
          <NavItem link="/create-exercise">Create Exercise</NavItem>
          <NavItem link="/record-workout">Record a Workout</NavItem>
          <NavItem link="/logout">Logout</NavItem>
        </>
      ) : (
        <NavItem link="/login">Login</NavItem>
      )}
    </ul>
  );
}
