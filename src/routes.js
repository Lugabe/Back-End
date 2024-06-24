import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import multer from 'multer';
import multerConfig from './config/multer';
import CategoryController from './app/controllers/CategoryController';
import authMiddleware from './app/middlewares/auth';
import OrderController from './app/controllers/OrderController';

const routes = Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware); // Todas as rotas a baixo deste Middleware precisam ser autenticas.

routes.post('/products', upload.single('file'), ProductController.store);
routes.post('/category', CategoryController.store);
routes.post('/orders', OrderController.store);

routes.get('/products', ProductController.index);
routes.get('/category', CategoryController.index);
routes.get('/orders', OrderController.index);

routes.put('/orders/:id', OrderController.updateOrderStatus);
routes.put('/products/:id', upload.single('file'), ProductController.updateProduct);
routes.put('/category/:id', CategoryController.updateCategory);

routes.delete('/products/:id', ProductController.deleteProduct)

export default routes;

// 'FLUXO' request -> middleware  -> controller -> model -> database -> response
