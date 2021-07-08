import { Switch, Route } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Search from './containers/Search/Search';
import './App.css';

function App() {
  const routes = (
    <Switch>
      <Route path="/" component={Search} />
    </Switch>
  );

  return (
    <div className="App">
      <Layout isAuthenticated={false}>{routes}</Layout>
    </div>
  );
}

export default App;
