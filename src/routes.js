import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import multer from 'multer';
import multerConfig from './config/multer';
import authMiddleware from './middlewares/auth';
import CategoryController from './app/controllers/CategoryController';

const routes = Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware); // Todas as rotas a baixo deste Middleware precisam ser autenticas.

routes.post('/products', upload.single('file'), ProductController.store);
routes.post('/category', CategoryController.store);
routes.get('/products', ProductController.index);
routes.get('/category', CategoryController.index);

export default routes;

// 'FLUXO' request -> middleware  -> controller -> model -> database -> response
