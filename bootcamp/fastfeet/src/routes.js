import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Rotas de Sessao
routes.post('/sessions', SessionController.store);

// Rotas de Usuario
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

// Definicao do Middleware de autenticacao para todas as rotas abaixo desta linha
routes.use(authMiddleware);

export default routes;
