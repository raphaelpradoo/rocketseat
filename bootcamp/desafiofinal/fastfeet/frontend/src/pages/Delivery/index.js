import React from 'react';
import api from '~/services/api';

import { Container } from './styles';

export default function Delivery() {
  api.get('deliverymen');

  return (
    <Container>
      <h1>Delivery</h1>
    </Container>
  );
}
