import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliverymanFeaturesController from './app/controllers/DeliverymanFeaturesController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import CompanyFeaturesController from './app/controllers/CompanyFeaturesController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// Sessão
routes.post('/sessions', SessionController.store);

// Usuários
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

// Tarefa dos Entregadores
routes.get('/deliverymen/:id', DeliverymanFeaturesController.index);
routes.get(
  '/deliverymen/:id/deliveries',
  DeliverymanFeaturesController.deliveries
);
routes.put(
  '/deliverymen/:id_deliveryman/receive/:id_delivery',
  DeliverymanFeaturesController.receive
);
routes.put(
  '/deliverymen/:id_deliveryman/close/:id_delivery',
  DeliverymanFeaturesController.close
);

// Problemas na Entrega
routes.get('/delivery/:id/problems', DeliveryProblemController.index);
routes.post('/delivery/:id/problems', DeliveryProblemController.store);

// Middleware de Autenticação via Token JWT
// para todas as rotas abaixo desta linha
routes.use(authMiddleware);

// Destinatário
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

// Arquivos
routes.post('/files', upload.single('file'), FileController.store);

// Entregadores
routes.get('/deliverymen', DeliverymanController.index);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

// Entregas
routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

// Tarefa da Empresa
routes.get('/problem-deliveries', CompanyFeaturesController.index);
routes.delete('/problem/:id/cancel-delivery', CompanyFeaturesController.delete);

export default routes;
