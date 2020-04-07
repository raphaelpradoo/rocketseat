import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import Delivery from '../pages/Delivery';
import Deliveryman from '../pages/Deliveryman';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/delivery" component={Delivery} isPrivate />
      <Route path="/deliverymen" component={Deliveryman} isPrivate />
    </Switch>
  );
}
