import { Switch, Route, withRouter, useHistory } from 'react-router-dom';

import { FirebaseContext } from './components/Firebase/index';
import Layout from './components/Layout/Layout';
import Search from './containers/Search/Search';
import Login from './containers/Auth/Login/Login';
import Register from './containers/Auth/Register/Register';
import './App.css';

function App({firebase}) {
  const history = useHistory();
  const routes = (
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
      <Route path="/" component={Search} />
    </Switch>
  );

  return (
    <div className="App">
      <Layout isAuthenticated={false}>{routes}</Layout>
    </div>
  );
}

export default withRouter(App);
