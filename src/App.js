import React from "react";
import LoginScreen from "./components/LoginScreen";
import TezApp from "./TezApp";
import { useRealmApp, RealmAppProvider } from "./RealmApp";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

export const APP_ID = "tez-ktigg";


export default function App() {
  return (
    <RealmAppProvider appId={APP_ID}>
      <Router>
        <Switch>
          <PrivateRoute exact path="/" >
            <TezApp />
          </PrivateRoute>
          <Route path="/signin">
            <LoginScreen />
          </Route>
          <Route path="/signup">
            <LoginScreen />
          </Route>
          <Route path="/test">
            <div>Tset page</div>
          </Route>
        </Switch>
      </Router>
    </RealmAppProvider>
  );
}

const PrivateRoute = ({children, ...rest}) => {
  const app = useRealmApp();

  return (
    <Route 
      {...rest}
      render={({location}) => 
        app.currentUser ? (children) : (
          <Redirect to={{pathname:"/signin", state: {from: location}}} />
        ) 
      } />
  )
}