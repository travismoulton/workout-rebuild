import { useState } from 'react';

import NavBar from '../Navigation/NavBar/NavBar';
import classes from './Layout.module.css';
import SideBar from '../Navigation/SideBar/SideBar';

export default function Layout({ isAuthenticated, children }) {
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <>
      <NavBar
        isAuthenticated={isAuthenticated}
        toggleSideBar={() =>
          setShowSideBar((prevShowSideBar) => !prevShowSideBar)
        }
      />
      <SideBar
        show={showSideBar}
        closed={() => setShowSideBar(false)}
        isAuthenticated={isAuthenticated}
      />
      <main data-testid="Main" className={classes.Main}>
        {children}
      </main>
    </>
  );
}
