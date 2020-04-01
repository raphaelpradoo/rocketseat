import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// Rotas de Sessão
routes.post('/sessions', SessionController.store);

// Rotas de Usuário
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

// Definição do Middleware de Autenticação via Token JWT para todas as rotas abaixo desta linha
routes.use(authMiddleware);

// Rotas de Destinatário
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

// Rotas de Arquivos
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
