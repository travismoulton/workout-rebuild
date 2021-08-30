import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, withRouter, useHistory } from 'react-router-dom';

import { authSuccess, authLogout } from './store/authSlice';
import { fetchFavorites, fetchActiveRoutine } from './store/favoritesSlice';
import {
  fetchWorkouts,
  fetchRoutines,
  fetchRecords,
} from './store/userProfileSlice';
import { FirebaseContext } from './components/Firebase/index';
import Layout from './components/Layout/Layout';
import Search from './containers/Search/Search';
import Results from './containers/Results/Results';
import Login from './containers/Auth/Login/Login';
import Logout from './components/Logout/Logout';
import Register from './containers/Auth/Register/Register';
import ExerciseDetail from './containers/ExerciseDetail/ExerciseDetail';
import CreateExercise from './containers/CreateExercise/CreateExercise';
import CreateWorkout from './containers/CreateWorkout/CreateWorkout';
import CreateRoutine from './containers/CreateRoutine/CreateRoutine';
import RecordWorkout from './containers/RecordWorkout/RecordWorkout';
import UserProfile from './containers/UserProfile/UserProfile';
import UpdatePassword from './components/UpdatePassword/UpdatePassword';
import SendPasswordResetEmail from './components/SendPasswordResetEmail/SendPasswordResetEmail';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.css';

function App({ firebase }) {
  const [authUser, setAuthUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.user !== null);
  const { inAuth, user, accessToken, uid } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth.onAuthStateChanged((authUser) => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);
      if (!userLoaded) setUserLoaded(true);
    });
  }, [firebase.auth, userLoaded]);

  useEffect(() => {
    if (authUser && !isAuthenticated && !inAuth && !user)
      dispatch(authSuccess(authUser));

    if (!authUser && user) dispatch(authLogout());
  }, [authUser, isAuthenticated, dispatch, inAuth, user]);

  useEffect(() => {
    if (userLoaded && !user) setAppReady(true);
  }, [userLoaded, user]);

  useEffect(() => {
    if (user && userLoaded) {
      Promise.all([
        dispatch(fetchFavorites({ uid, accessToken })),
        dispatch(fetchActiveRoutine({ uid, accessToken })),
        dispatch(fetchWorkouts({ uid, accessToken })),
        dispatch(fetchRoutines({ uid, accessToken })),
        dispatch(fetchRecords({ uid, accessToken })),
      ]).then(() => setAppReady(true));
    }
  }, [user, dispatch, uid, accessToken, userLoaded]);

  const history = useHistory();

  const routes = !isAuthenticated ? (
    <Switch>
      <Route path="/register">
        <FirebaseContext.Consumer>
          {(firebase) => <Register firebase={firebase} history={history} />}
        </FirebaseContext.Consumer>
      </Route>
      <Route path="/login">
        <FirebaseContext.Consumer>
          {(firebase) => <Login firebase={firebase} history={history} />}
        </FirebaseContext.Consumer>
      </Route>
      <Route path="/results/:category/:query" component={Results} />
      <Route
        path="/exercise/:name"
        render={(routeProps) => (
          <ErrorBoundary>
            <ExerciseDetail {...routeProps} />
          </ErrorBoundary>
        )}
      />
      <Route path="/forgot-password">
        <FirebaseContext.Consumer>
          {(firebase) => (
            <SendPasswordResetEmail firebase={firebase} history={history} />
          )}
        </FirebaseContext.Consumer>
      </Route>
      <Route path="/" component={Search} />
    </Switch>
  ) : (
    <Switch>
      <Route path="/logout">
        <FirebaseContext.Consumer>
          {(firebase) => <Logout firebase={firebase} />}
        </FirebaseContext.Consumer>
      </Route>
      <Route path="/login">
        <FirebaseContext.Consumer>
          {(firebase) => <Login firebase={firebase} history={history} />}
        </FirebaseContext.Consumer>
      </Route>
      <Route path="/create-exercise" component={CreateExercise} />
      <Route path="/create-workout" component={CreateWorkout} />
      <Route path="/create-routine" component={CreateRoutine} />
      <Route path="/record-workout" component={RecordWorkout} />
      <Route path="/my-profile" component={UserProfile} />
      <Route path="/update-password" component={UpdatePassword} />
      <Route
        path="/exercise/:name"
        render={(routeProps) => (
          <ErrorBoundary>
            <ExerciseDetail {...routeProps} />
          </ErrorBoundary>
        )}
      />
      <Route path="/forgot-password">
        <FirebaseContext.Consumer>
          {(firebase) => (
            <SendPasswordResetEmail firebase={firebase} history={history} />
          )}
        </FirebaseContext.Consumer>
      </Route>
      <Route path="/results/:category/:query" component={Results} />
      <Route path="/results/my-custom-exercises" component={Results} />
      <Route path="/" component={Search} />
    </Switch>
  );

  return (
    <div className="App">
      {appReady && <Layout isAuthenticated={isAuthenticated}>{routes}</Layout>}
    </div>
  );
}

export default withRouter(App);
