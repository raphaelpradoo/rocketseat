import React from 'react';
import { Link } from 'react-router-dom';

import logo from '~/assets/fastfeet-logo.png';

import { Container, Content, Profile } from './styles';

export default function Header() {
  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="FastFeet" />
          <Link to="/delivery">ENTREGAS</Link>
          <Link to="/">ENTREGADORES</Link>
          <Link to="/">DESTINATÁRIOS</Link>
          <Link to="/">PROBLEMAS</Link>
        </nav>

        <aside>
          <Profile>
            <div>
              <strong>Raphael</strong>
              <Link to="/signup">Sair do Sistema</Link>
            </div>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
