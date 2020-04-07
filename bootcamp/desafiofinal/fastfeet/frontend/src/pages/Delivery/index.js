import React from 'react';
import api from '~/services/api';

import { Container, Title, Actions, Find, Add } from './styles';

export default function Delivery() {
  // Buscando as Encomendas do Backend
  api.get('deliveries');

  return (
    <Container>
      <Title>Gerenciando encomendas</Title>
      <Actions>
        <Find>
          <input
            type="text"
            name="find_delivery"
            id="find_delivery"
            placeholder="Buscar por encomendas"
          />
        </Find>
        <Add>
          <button type="submit">CADASTRAR</button>
        </Add>
      </Actions>
    </Container>
  );
}
