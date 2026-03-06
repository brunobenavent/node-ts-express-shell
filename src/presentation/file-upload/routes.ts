import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { FileUploadController } from '../category/controller';





export class FileUploadRoutes {


  static get routes(): Router {

    const controller = new FileUploadController()
    const router = Router();

    // Definir las rutas
    router.post('/single/:type', controller.uploadFile);
    router.post('/multiple/:type', controller.uploadMultipleFiles);


    return router;
  }


}

