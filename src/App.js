import React from 'react';
import './App.less';
import {BrowserRouter, Route, Switch} from "react-router-dom";

import Login from './pages/login/login'
import Admin from './pages/admin/index/admin'
import User from "./pages/user/index/user"


function App() {
  return (
      <BrowserRouter>
          <Switch>
              <Route path={'/login'} component={Login}/>
              <Route path={'/admin'} component={Admin}/>
              <Route path={'/users'} component={User}/>
              <Route component={Login}/>
          </Switch>
      </BrowserRouter>
  );
}

export default App;
