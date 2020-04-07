import React from 'react';
import { Form, Input } from '@rocketseat/unform';
import api from '~/services/api';

import { Container, Title, Actions, Find, Add } from './styles';

export default function Delivery() {
  // Buscando as Encomendas do Backend
  const deliveries = api.get('deliveries');

  return (
    <Container>
      <Title>Gerenciando encomendas</Title>
      <Actions>
        <Find>
          <Input name="find_delivery" placeholder="Buscar por encomendas" />
        </Find>
        <Add>
          <button type="submit">CADASTRAR</button>
        </Add>
      </Actions>

      <Form initialData={deliveries} />
    </Container>
  );
}
