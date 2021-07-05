import { Switch, Route } from "react-router-dom";

import Search from "./containers/Search/Search";
import "./App.css";

function App() {
  const routes = (
    <Switch>
      <Route path="/" component={Search} />
    </Switch>
  );

  return <div className="App">{routes}</div>;
}

export default App;
