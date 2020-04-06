import 'dotenv/config';

import express from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Permite o acesso de qualquer aplicação à nossa API
    this.server.use(cors());

    // Aplicação apta à receber requisições no formato JSON
    this.server.use(express.json());

    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    // Importanto as rotas do arquivo routes.js
    this.server.use(routes);
  }
}

export default new App().server;
