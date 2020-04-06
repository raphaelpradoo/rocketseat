import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
// import Main from './pages/Main';
import Deliveryman from '../pages/Deliveryman';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route path="/deliverymen" component={Deliveryman} isPrivate />
    </Switch>
  );
}
