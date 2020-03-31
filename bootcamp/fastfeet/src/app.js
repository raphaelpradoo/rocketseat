import 'dotenv/config';
import express from 'express';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Aplicacao apta a receber requisicoes no formato JSON
    this.server.use(express.json());
  }

  routes() {
    // Importanto as rotas do arquivo routes.js
    this.server.use(routes);
  }
}

export default new App().server;
